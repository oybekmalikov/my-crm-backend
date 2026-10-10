import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoursePlan, CoursePlanDocument } from '../course-plans/entities/course-plan.entity';
import { CreateStudentsContractDto } from './dto/create-students-contract.dto';
import { UpdateStudentsContractDto } from './dto/update-students-contract.dto';
import { StudentsContract, StudentsContractDocument } from './entities/students-contract.entity';
import { StudentPayment, StudentPaymentDocument } from '../student-payments/entities/student-payment.entity';

@Injectable()
export class StudentsContractsService {
  constructor(
    @InjectModel(StudentsContract.name) private studentsContractModel: Model<StudentsContractDocument>,
    @InjectModel(StudentPayment.name) private studentPaymentModel: Model<StudentPaymentDocument>,
    @InjectModel(CoursePlan.name) private coursePlanModel: Model<CoursePlanDocument>,
  ) {}

  /**
   * #33 — CoursePlan integration.
   * Creates a contract and generates installments using CoursePlan pricing.
   * If coursePlanId is provided the total amount is derived from the plan.
   * customDiscount acts as a flat discount on the plan-derived total.
   */
  async createWithPlan(
    dto: CreateStudentsContractDto & { coursePlanId?: string },
  ) {
    let totalAmount = dto.customDiscount ?? 0;

    if (dto.coursePlanId) {
      const plan = await this.coursePlanModel.findById(dto.coursePlanId).exec();
      if (!plan) throw new NotFoundException('COURSE_PLAN.NOT_FOUND');

      const planPriceMap: Record<string, number> = {
        monthly: plan.monthlyPrice,
        half: plan.halfCoursePrice,
        full: plan.fullCoursePrice,
      };

      const baseTotal = planPriceMap[dto.selectedPlan] ?? plan.basePrice;
      const discountAmount = dto.customDiscount ?? 0;
      totalAmount = Math.max(0, baseTotal - discountAmount);
    }

    const record = await this.studentsContractModel.create({
      ...dto,
      customDiscount: totalAmount,
    });
    await this.generateInstallments(record._id.toString(), {
      ...dto,
      customDiscount: totalAmount,
    });

    return {
      message: 'STUDENTS_CONTRACT.CREATED',
      data: record,
      success: true,
    };
  }

  /**
   * #34 — Plan change.
   * When selectedPlan changes: cancel all pending installments, then generate
   * new ones based on the new plan (with optional CoursePlan pricing).
   */
  async changePlan(
    contractId: string,
    newPlan: 'monthly' | 'half' | 'full',
    coursePlanId?: string,
    customDiscount?: number,
  ) {
    const contract = await this.studentsContractModel.findById(contractId).exec();
    if (!contract) throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');

    if (contract.selectedPlan === newPlan && !coursePlanId) {
      throw new BadRequestException('STUDENTS_CONTRACT.SAME_PLAN_SELECTED');
    }

    // Cancel all pending installments
    const cancelResult = await this.studentPaymentModel.updateMany(
      { offerId: contractId, status: 'pending', isDeleted: false },
      { status: 'cancelled', isDeleted: true },
    );

    // Update contract plan
    await this.studentsContractModel.findByIdAndUpdate(contractId, {
      selectedPlan: newPlan,
    });

    // Compute new total from CoursePlan if provided
    let totalAmount = customDiscount ?? contract.customDiscount ?? 0;
    if (coursePlanId) {
      const plan = await this.coursePlanModel.findById(coursePlanId).exec();
      if (!plan) throw new NotFoundException('COURSE_PLAN.NOT_FOUND');
      const planPriceMap: Record<string, number> = {
        monthly: plan.monthlyPrice,
        half: plan.halfCoursePrice,
        full: plan.fullCoursePrice,
      };
      const base = planPriceMap[newPlan] ?? plan.basePrice;
      const disc = customDiscount ?? 0;
      totalAmount = Math.max(0, base - disc);
    }

    // Generate fresh installments
    await this.generateInstallments(contractId, {
      studentId: contract.studentId.toString(),
      contractId: contract.contractId.toString(),
      courseId: contract.courseId.toString(),
      selectedPlan: newPlan,
      customDiscount: totalAmount,
    });

    return {
      message: 'STUDENTS_CONTRACT.PLAN_CHANGED',
      data: {
        contractId,
        newPlan,
        cancelledInstallments: cancelResult.modifiedCount,
        newTotalAmount: totalAmount,
      },
      success: true,
    };
  }

  async create(createStudentsContractDto: CreateStudentsContractDto) {
    const record = await this.studentsContractModel.create(createStudentsContractDto);
    await this.generateInstallments(record._id.toString(), createStudentsContractDto);
    return {
      message: 'STUDENTS_CONTRACT.CREATED',
      data: record,
      success: true,
    };
  }

  /**
   * Generates installment StudentPayment records for a newly created contract.
   * selectedPlan: 'monthly' => 12 installments, 'half' => 6, 'full' => 1.
   * customDiscount is treated as a flat amount deducted from each installment.
   */
  async generateInstallments(contractId: string, dto: CreateStudentsContractDto) {
    const planMap: Record<string, number> = { monthly: 12, half: 6, full: 1 };
    const installments = planMap[dto.selectedPlan] ?? 1;

    // We don't have a base price on the contract template in this entity,
    // so we generate placeholder installments with amount=0 that get
    // filled in when the admin records actual payment amounts; however we
    // still respect customDiscount as a per-installment reduction.
    // If customDiscount represents the total contract value, split it evenly.
    const totalAmount = dto.customDiscount ?? 0;
    const perInstallment = installments > 0 ? Math.round(totalAmount / installments) : 0;

    const now = new Date();
    const payments: Array<{
      offerId: string;
      amount: number;
      paymentDate: null;
      dueDate: Date;
      paymentType: string;
      notes: string;
      status: string;
      installmentNumber: number;
      isDeleted: boolean;
    }> = [];
    for (let i = 0; i < installments; i++) {
      const dueDate = new Date(now.getFullYear(), now.getMonth() + i, now.getDate());
      payments.push({
        offerId: contractId,
        amount: perInstallment,
        paymentDate: null,
        dueDate,
        paymentType: '',
        notes: `Installment ${i + 1} of ${installments}`,
        status: 'pending',
        installmentNumber: i + 1,
        isDeleted: false,
      });
    }
    await this.studentPaymentModel.insertMany(payments);
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentsContractModel
      .find()
      .populate('studentId')
      .populate('contractId')
      .populate('courseId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentsContractModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'STUDENTS_CONTRACT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENTS_CONTRACT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.studentsContractModel
      .findById(id)
      .populate('studentId')
      .populate('contractId')
      .populate('courseId')
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_CONTRACT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateStudentsContractDto: UpdateStudentsContractDto) {
    const record = await this.studentsContractModel
      .findByIdAndUpdate(id, updateStudentsContractDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_CONTRACT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentsContractModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENTS_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_CONTRACT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
