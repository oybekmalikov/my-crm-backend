import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model, Types } from 'mongoose';
import { CreateStudentPaymentDto } from './dto/create-student-payment.dto';
import { UpdateStudentPaymentDto } from './dto/update-student-payment.dto';
import { StudentPayment, StudentPaymentDocument } from './entities/student-payment.entity';
import { BudgetTransaction, BudgetTransactionDocument } from '../budget-transactions/entities/budget-transaction.entity';
import { Budget, BudgetDocument } from '../budgets/entities/budget.entity';
import { StudentsContract, StudentsContractDocument } from '../students-contracts/entities/students-contract.entity';
import { Student, StudentDocument } from '../students/entities/student.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { EmailService } from '../common/services/email.service';

@Injectable()
export class StudentPaymentsService {
  constructor(
    @InjectModel(StudentPayment.name) private studentPaymentModel: Model<StudentPaymentDocument>,
    @InjectModel(BudgetTransaction.name) private budgetTransactionModel: Model<BudgetTransactionDocument>,
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
    @InjectModel(StudentsContract.name) private studentsContractModel: Model<StudentsContractDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  async create(createStudentPaymentDto: CreateStudentPaymentDto) {
    const record = await this.studentPaymentModel.create(createStudentPaymentDto);
    if (record.status === 'completed') {
      await this.createIncomeBudgetTransaction(record);
    }
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
    const existing = await this.studentPaymentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!existing) {
      throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');
    }
    const previousStatus = existing.status;

    const record = await this.studentPaymentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateStudentPaymentDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');
    }

    // Auto-create budget transaction when payment transitions to completed
    if (record.status === 'completed' && previousStatus !== 'completed') {
      await this.createIncomeBudgetTransaction(record);
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

  /**
   * Finds all pending/overdue payments past their dueDate, marks them overdue,
   * sends in-app notifications and optional emails.
   * Called manually via POST /student-payments/overdue-check (ADMIN) and by a cron job.
   */
  async runOverdueCheck(): Promise<{ message: string; data: { processed: number; deactivated: number }; success: boolean }> {
    const now = new Date();
    const overduePayments = await this.studentPaymentModel
      .find({
        isDeleted: false,
        status: { $in: ['pending'] },
        dueDate: { $lt: now, $ne: null },
      })
      .exec();

    let processed = 0;
    for (const payment of overduePayments) {
      await this.studentPaymentModel.findByIdAndUpdate(payment._id, { status: 'overdue' }).exec();

      // Resolve student userId via the contract chain
      try {
        const contract = await this.studentsContractModel.findById(payment.offerId).exec();
        if (!contract) continue;

        const student = await this.studentModel.findById(contract.studentId).exec();
        if (!student) continue;

        const userId = student.userId.toString();

        await this.notificationsService.create({
          userId,
          title: 'Payment Overdue',
          message: `Your installment #${payment.installmentNumber} of ${payment.amount} is overdue (was due ${payment.dueDate?.toDateString()}).`,
          type: 'warning',
        });

        // Optional email
        const user = await this.userModel.findById(userId).exec();
        if (user?.email) {
          await this.emailService.sendMail(
            user.email,
            'Payment Overdue Reminder',
            `<p>Dear ${user.firstName},</p>
             <p>Your installment #${payment.installmentNumber} of <strong>${payment.amount}</strong> was due on ${payment.dueDate?.toDateString()} and has not been paid.</p>
             <p>Please contact your training center to arrange payment.</p>`,
          );
        }

        processed++;
      } catch {
        // skip individual errors to not abort entire batch
      }
    }

    const deactivatedCount = await this.deactivateOverdueStudents();

    return {
      message: 'STUDENT_PAYMENT.OVERDUE_CHECK_DONE',
      data: { processed, deactivated: deactivatedCount },
      success: true,
    };
  }

  /** Accept a payment in one step: set amount, type, date, status=completed, receipt. */
  async acceptPayment(
    id: string,
    body: { amount: number; paymentType: string; paymentDate?: Date; notes?: string },
  ) {
    const existing = await this.studentPaymentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!existing) {
      throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');
    }

    const receiptNumber = this.generateReceiptNumber();
    const record = await this.studentPaymentModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          amount: body.amount,
          paymentType: body.paymentType,
          paymentDate: body.paymentDate ?? new Date(),
          notes: body.notes ?? existing.notes,
          status: 'completed',
          receiptNumber,
        },
        { new: true },
      )
      .exec();

    if (record) {
      await this.createIncomeBudgetTransaction(record);
    }

    return {
      message: 'STUDENT_PAYMENT.ACCEPTED',
      data: record,
      success: true,
    };
  }

  /** Get the next pending/overdue payment for a student. */
  async getNextPaymentForStudent(studentId: string) {
    const contracts = await this.studentsContractModel.find({ studentId, isActive: true }).exec();
    if (contracts.length === 0) {
      return {
        message: 'STUDENT_PAYMENT.NO_CONTRACT',
        data: null,
        success: true,
      };
    }

    const contractIds = contracts.map((c) => c._id.toString());
    const nextPayment = await this.studentPaymentModel
      .findOne({
        offerId: { $in: contractIds },
        isDeleted: false,
        status: { $in: ['pending', 'overdue'] },
      })
      .sort({ dueDate: 1 })
      .exec();

    return {
      message: 'STUDENT_PAYMENT.NEXT_FOUND',
      data: nextPayment,
      success: true,
    };
  }

  /** Deactivate students with payments overdue 30+ days. */
  async deactivateOverdueStudents(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const overduePayments = await this.studentPaymentModel
      .find({
        isDeleted: false,
        status: 'overdue',
        dueDate: { $lt: thirtyDaysAgo },
      })
      .exec();

    const studentIds = new Set<string>();
    for (const payment of overduePayments) {
      const contract = await this.studentsContractModel.findById(payment.offerId).exec();
      if (contract) {
        studentIds.add(contract.studentId.toString());
      }
    }

    let deactivated = 0;
    for (const sid of studentIds) {
      const student = await this.studentModel.findById(sid).exec();
      if (student?.isActive) {
        await this.studentModel.findByIdAndUpdate(sid, { isActive: false }).exec();
        await this.notificationsService.createFromTemplate(
          'student_deactivated_overdue',
          student.userId.toString(),
          {},
        );
        deactivated++;
      }
    }
    return deactivated;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // #44 — Automated daily overdue cron job
  // ────────────────────────────────────────────────────────────────────────────
  /** Runs every day at 08:00 AM — automatically marks overdue payments and deactivates students. */
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async cronDailyOverdueCheck(): Promise<void> {
    await this.runOverdueCheck();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // #43 — Payment reminder cron (3 days before dueDate)
  // ────────────────────────────────────────────────────────────────────────────
  /** Runs every day at 09:00 AM — sends reminders for payments due in exactly 3 days. */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async cronPaymentReminders(): Promise<void> {
    await this.sendUpcomingPaymentReminders();
  }

  /**
   * #43 — Sends notification + email to students whose payment is due in 3 days.
   * Can also be triggered manually via the API.
   */
  async sendUpcomingPaymentReminders(): Promise<{ message: string; data: { notified: number }; success: boolean }> {
    const now = new Date();
    const threeDaysLater = new Date(now);
    threeDaysLater.setDate(now.getDate() + 3);

    // Find payments due in the next 3 days (between now and +3 days)
    const upcomingPayments = await this.studentPaymentModel
      .find({
        isDeleted: false,
        status: 'pending',
        dueDate: {
          $gte: now,
          $lte: threeDaysLater,
        },
      })
      .exec();

    let notified = 0;
    for (const payment of upcomingPayments) {
      try {
        const contract = await this.studentsContractModel.findById(payment.offerId).exec();
        if (!contract) continue;

        const student = await this.studentModel.findById(contract.studentId).exec();
        if (!student) continue;

        const userId = student.userId.toString();
        const daysLeft = Math.ceil(
          ((payment.dueDate?.getTime() ?? 0) - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        await this.notificationsService.create({
          userId,
          title: 'Upcoming Payment Reminder',
          message: `Your installment #${payment.installmentNumber} of ${payment.amount} is due in ${daysLeft} day(s) (${payment.dueDate?.toDateString()}).`,
          type: 'info',
        });

        const user = await this.userModel.findById(userId).exec();
        if (user?.email) {
          await this.emailService.sendMail(
            user.email,
            'Payment Reminder',
            `<p>Dear ${user.firstName},</p>
             <p>This is a reminder that your installment #${payment.installmentNumber} of <strong>${payment.amount}</strong> is due on <strong>${payment.dueDate?.toDateString()}</strong>.</p>
             <p>Please arrange payment in time to avoid late fees.</p>`,
          );
        }
        notified++;
      } catch {
        // skip individual errors
      }
    }

    return {
      message: 'STUDENT_PAYMENT.REMINDERS_SENT',
      data: { notified },
      success: true,
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // #45 — Partial payment
  // ────────────────────────────────────────────────────────────────────────────
  /**
   * #45 — Records a partial payment.
   * If paidAmount < full installment amount, the remainder is split into a new
   * pending record. The original record is marked completed for the paid portion.
   */
  async partialPayment(
    id: string,
    body: { paidAmount: number; paymentType: string; paymentDate?: Date; notes?: string },
  ): Promise<{ message: string; data: any; success: boolean }> {
    const existing = await this.studentPaymentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!existing) throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');

    const { paidAmount, paymentType, paymentDate, notes } = body;
    const remaining = existing.amount - paidAmount;

    // Mark the current record as completed for the paid amount
    const receiptNumber = this.generateReceiptNumber();
    const paid = await this.studentPaymentModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        {
          amount: paidAmount,
          paymentType,
          paymentDate: paymentDate ?? new Date(),
          notes: notes ?? existing.notes,
          status: 'completed',
          receiptNumber,
        },
        { new: true },
      )
      .exec();

    if (paid) {
      await this.createIncomeBudgetTransaction(paid);
    }

    let remainder: StudentPaymentDocument | null = null;
    if (remaining > 0) {
      // Create a new pending record for the unpaid remainder
      remainder = await this.studentPaymentModel.create({
        offerId: existing.offerId.toString(),
        amount: remaining,
        paymentDate: null,
        dueDate: existing.dueDate,
        paymentType: '',
        notes: `Remaining balance from installment #${existing.installmentNumber} (partial payment)`,
        status: 'pending',
        installmentNumber: existing.installmentNumber,
        isDeleted: false,
      });
    }

    return {
      message: 'STUDENT_PAYMENT.PARTIAL_ACCEPTED',
      data: { paid, remainder },
      success: true,
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // #46 — Refund workflow
  // ────────────────────────────────────────────────────────────────────────────
  /**
   * #46 — Refund a completed payment.
   * Updates status to refunded, records reason, and creates an expense transaction.
   */
  async refundPayment(id: string, refundReason: string): Promise<{ message: string; data: any; success: boolean }> {
    const payment = await this.studentPaymentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!payment) throw new NotFoundException('STUDENT_PAYMENT.NOT_FOUND');

    if (payment.status !== 'completed') {
      throw new BadRequestException('STUDENT_PAYMENT.ONLY_COMPLETED_CAN_BE_REFUNDED');
    }

    // Update payment status
    payment.status = 'refunded';
    payment.notes = payment.notes ? `${payment.notes} | Refund reason: ${refundReason}` : `Refund reason: ${refundReason}`;
    await payment.save();

    // Create an expense transaction to offset the income
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const budget = await this.findOrCreateBudget(year, month);

    await this.budgetTransactionModel.create({
      budgetId: budget._id.toString(),
      categoryId: new Types.ObjectId().toString(), // placeholder
      source: `student-payment-refund:${payment._id.toString()}`,
      target: 'expense',
      totalSum: payment.amount,
      description: `Refund for Student payment #${payment.installmentNumber ?? ''} - ${refundReason}`,
      createdBy: new Types.ObjectId().toString(), // system/admin
      status: 'completed',
    });

    // Update budget totals
    await this.budgetModel.findByIdAndUpdate(budget._id, {
      $inc: { totalExpense: payment.amount, netBalance: -payment.amount },
    }).exec();

    return {
      message: 'STUDENT_PAYMENT.REFUNDED',
      data: payment,
      success: true,
    };
  }

  private generateReceiptNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP-${datePart}-${random}`;
  }

  /**
   * Finds or creates a Budget record for the given year/month and creates a
   * BudgetTransaction of type income linked to a completed student payment.
   * Guards against double-creation by checking for an existing transaction
   * with matching source (payment id).
   */
  private async createIncomeBudgetTransaction(payment: StudentPaymentDocument): Promise<void> {
    const paymentId = (payment._id as Types.ObjectId).toString();

    // Guard: skip if a transaction for this payment already exists
    const existing = await this.budgetTransactionModel
      .findOne({ source: `student-payment:${paymentId}`, isDeleted: false })
      .exec();
    if (existing) return;

    const date = payment.paymentDate ? new Date(payment.paymentDate) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const budget = await this.findOrCreateBudget(year, month);

    await this.budgetTransactionModel.create({
      budgetId: budget._id.toString(),
      categoryId: new Types.ObjectId().toString(), // placeholder — no PaymentType linked here
      source: `student-payment:${paymentId}`,
      target: 'income',
      totalSum: payment.amount,
      description: `Student payment #${payment.installmentNumber ?? ''} (auto)`,
      createdBy: new Types.ObjectId().toString(), // system placeholder
      status: 'completed',
    });

    // Update budget totals
    await this.budgetModel.findByIdAndUpdate(budget._id, {
      $inc: { totalIncome: payment.amount, netBalance: payment.amount },
    }).exec();
  }

  private async findOrCreateBudget(year: number, month: number): Promise<BudgetDocument> {
    let budget = await this.budgetModel.findOne({ year, month }).exec();
    if (!budget) {
      budget = await this.budgetModel.create({
        year,
        month,
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        description: `Auto-generated budget for ${year}-${month}`,
        createdBy: new Types.ObjectId().toString(),
      });
    }
    return budget;
  }
}
