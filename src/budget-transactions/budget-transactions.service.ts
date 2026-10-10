import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetTransactionDto } from './dto/create-budget-transaction.dto';
import { UpdateBudgetTransactionDto } from './dto/update-budget-transaction.dto';
import { BudgetTransaction, BudgetTransactionDocument } from './entities/budget-transaction.entity';

@Injectable()
export class BudgetTransactionsService {
  constructor(
    @InjectModel(BudgetTransaction.name) private budgetTransactionModel: Model<BudgetTransactionDocument>,
  ) {}

  async create(createBudgetTransactionDto: CreateBudgetTransactionDto) {
    const record = await this.budgetTransactionModel.create(createBudgetTransactionDto);
    return {
      message: 'BUDGET_TRANSACTION.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.budgetTransactionModel
      .find({ isDeleted: false })
      .populate('budgetId')
      .populate('categoryId')
      .populate('createdBy')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.budgetTransactionModel.countDocuments({ isDeleted: false });

    if (data.length === 0) {
      return {
        message: 'BUDGET_TRANSACTION.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'BUDGET_TRANSACTION.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.budgetTransactionModel
      .findOne({ _id: id, isDeleted: false })
      .populate('budgetId')
      .populate('categoryId')
      .populate('createdBy')
      .exec();
    if (!record) {
      throw new NotFoundException('BUDGET_TRANSACTION.NOT_FOUND');
    }
    return {
      message: 'BUDGET_TRANSACTION.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateBudgetTransactionDto: UpdateBudgetTransactionDto) {
    const record = await this.budgetTransactionModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateBudgetTransactionDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('BUDGET_TRANSACTION.NOT_FOUND');
    }
    return {
      message: 'BUDGET_TRANSACTION.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.budgetTransactionModel
      .findByIdAndUpdate(id, { isDeleted: true, status: 'refunded' }, { new: true })
      .exec();
    if (!deleted) {
      throw new NotFoundException('BUDGET_TRANSACTION.NOT_FOUND');
    }
    return {
      message: 'BUDGET_TRANSACTION.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
