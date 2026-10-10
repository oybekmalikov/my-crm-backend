import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateWorkerPaymentDto } from './dto/create-worker-payment.dto';
import { UpdateWorkerPaymentDto } from './dto/update-worker-payment.dto';
import { WorkerPayment, WorkerPaymentDocument } from './entities/worker-payment.entity';
import { WorkerContract, WorkerContractDocument } from '../worker-contracts/entities/worker-contract.entity';
import { Staff, StaffDocument } from '../staffs/entities/staff.entity';
import { BudgetTransaction, BudgetTransactionDocument } from '../budget-transactions/entities/budget-transaction.entity';
import { Budget, BudgetDocument } from '../budgets/entities/budget.entity';

@Injectable()
export class WorkerPaymentsService {
  constructor(
    @InjectModel(WorkerPayment.name) private workerPaymentModel: Model<WorkerPaymentDocument>,
    @InjectModel(WorkerContract.name) private workerContractModel: Model<WorkerContractDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    @InjectModel(BudgetTransaction.name) private budgetTransactionModel: Model<BudgetTransactionDocument>,
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  async create(createWorkerPaymentDto: CreateWorkerPaymentDto) {
    const record = await this.workerPaymentModel.create(createWorkerPaymentDto);
    if (record.status === 'completed') {
      await this.createExpenseBudgetTransaction(record);
      await this.markStaffSalaryPaid(record);
    }
    return {
      message: 'WORKER_PAYMENT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.workerPaymentModel
      .find({ isDeleted: false })
      .populate('workerContractId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.workerPaymentModel.countDocuments({ isDeleted: false });

    if (data.length === 0) {
      return {
        message: 'WORKER_PAYMENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'WORKER_PAYMENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.workerPaymentModel
      .findOne({ _id: id, isDeleted: false })
      .populate('workerContractId')
      .exec();
    if (!record) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'WORKER_PAYMENT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateWorkerPaymentDto: UpdateWorkerPaymentDto) {
    const existing = await this.workerPaymentModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!existing) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }
    const previousStatus = existing.status;

    const record = await this.workerPaymentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateWorkerPaymentDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }

    // Auto-create expense budget transaction on completion
    if (record.status === 'completed' && previousStatus !== 'completed') {
      await this.createExpenseBudgetTransaction(record);
      await this.markStaffSalaryPaid(record);
    }

    return {
      message: 'WORKER_PAYMENT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.workerPaymentModel
      .findByIdAndUpdate(id, { isDeleted: true, status: 'refunded' }, { new: true })
      .exec();
    if (!deleted) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'WORKER_PAYMENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  /**
   * Generates a WorkerPayment for a specific WorkerContract's current pay period.
   * Avoids duplicate generation if a payment for the same contract/year/month already exists.
   */
  async generateMonthlyPayrollForContract(contractId: string, year?: number, month?: number): Promise<{ message: string; data: any; success: boolean }> {
    const contract = await this.workerContractModel.findOne({ _id: contractId, isActive: true }).exec();
    if (!contract) {
      throw new NotFoundException('WORKER_CONTRACT.NOT_FOUND');
    }

    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? (now.getMonth() + 1);

    // Duplicate guard
    const existing = await this.workerPaymentModel.findOne({
      workerContractId: contractId,
      payrollYear: targetYear,
      payrollMonth: targetMonth,
      isDeleted: false,
    }).exec();

    if (existing) {
      throw new ConflictException('WORKER_PAYMENT.PAYROLL_ALREADY_GENERATED');
    }

    const record = await this.workerPaymentModel.create({
      workerContractId: contractId,
      amount: contract.baseSalary,
      paymentDate: null,
      paymentType: 'payroll',
      notes: `Auto payroll for ${targetYear}-${String(targetMonth).padStart(2, '0')}`,
      status: 'pending',
      payrollYear: targetYear,
      payrollMonth: targetMonth,
      isDeleted: false,
    });

    return {
      message: 'WORKER_PAYMENT.PAYROLL_GENERATED',
      data: record,
      success: true,
    };
  }

  /**
   * Generates monthly payroll for ALL active worker contracts for a given period.
   * Already-generated contracts are skipped (no duplicate error thrown, just counted).
   */
  async generateMonthlyPayrollForAll(year?: number, month?: number): Promise<{ message: string; data: { generated: number; skipped: number }; success: boolean }> {
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? (now.getMonth() + 1);

    const contracts = await this.workerContractModel.find({ isActive: true }).exec();

    let generated = 0;
    let skipped = 0;

    for (const contract of contracts) {
      const contractId = (contract._id as Types.ObjectId).toString();
      const existing = await this.workerPaymentModel.findOne({
        workerContractId: contractId,
        payrollYear: targetYear,
        payrollMonth: targetMonth,
        isDeleted: false,
      }).exec();

      if (existing) {
        skipped++;
        continue;
      }

      await this.workerPaymentModel.create({
        workerContractId: contractId,
        amount: contract.baseSalary,
        paymentDate: null,
        paymentType: 'payroll',
        notes: `Auto payroll for ${targetYear}-${String(targetMonth).padStart(2, '0')}`,
        status: 'pending',
        payrollYear: targetYear,
        payrollMonth: targetMonth,
        isDeleted: false,
      });
      generated++;
    }

    return {
      message: 'WORKER_PAYMENT.PAYROLL_ALL_GENERATED',
      data: { generated, skipped },
      success: true,
    };
  }

  private async markStaffSalaryPaid(payment: WorkerPaymentDocument): Promise<void> {
    const contract = await this.workerContractModel.findById(payment.workerContractId).exec();
    if (!contract) return;
    await this.staffModel.findByIdAndUpdate(contract.workerId, {
      salary_paid_for_last_month: true,
    }).exec();
  }

  private async createExpenseBudgetTransaction(payment: WorkerPaymentDocument): Promise<void> {
    const paymentId = (payment._id as Types.ObjectId).toString();

    // Guard: skip if already exists
    const existing = await this.budgetTransactionModel
      .findOne({ source: `worker-payment:${paymentId}`, isDeleted: false })
      .exec();
    if (existing) return;

    const date = payment.paymentDate ? new Date(payment.paymentDate) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const budget = await this.findOrCreateBudget(year, month);

    await this.budgetTransactionModel.create({
      budgetId: budget._id.toString(),
      categoryId: new Types.ObjectId().toString(),
      source: `worker-payment:${paymentId}`,
      target: 'expense',
      totalSum: payment.amount,
      description: `Worker payroll payment (auto)`,
      createdBy: new Types.ObjectId().toString(),
      status: 'completed',
    });

    await this.budgetModel.findByIdAndUpdate(budget._id, {
      $inc: { totalExpense: payment.amount, netBalance: -payment.amount },
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
