import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentPaymentDto } from './dto/create-student-payment.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';
import { StudentPayment, StudentPaymentDocument } from './entities/student-payment.entity';

@Injectable()
export class StudentPaymentsService {
  constructor(
    @InjectModel(StudentPayment.name) private studentPaymentModel: Model<StudentPaymentDocument>,
  ) {}

  async create(createStudentPaymentDto: CreateStudentPaymentDto) {
    const record = await this.studentPaymentModel.create(createStudentPaymentDto);
    return {
      message: 'STUDENT_PAYMENT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentPaymentModel
      .find({ isDeleted: false })
      .populate('offerId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentPaymentModel.countDocuments({ isDeleted: false });

    if (data.length === 0) {
      return {
        message: 'STUDENT_PAYMENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENT_PAYMENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.studentPaymentModel
      .findOne({ _id: id, isDeleted: false })
      .populate('offerId')
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_PAYMENT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateStudentPaymentDto: UpdateStudentPaymentDto) {
    const record = await this.studentPaymentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateStudentPaymentDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_PAYMENT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentPaymentModel
      .findByIdAndUpdate(id, { isDeleted: true, status: 'refunded' }, { new: true })
      .exec();
    if (!deleted) {
      throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT_PAYMENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
