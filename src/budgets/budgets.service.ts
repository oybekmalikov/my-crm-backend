import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget, BudgetDocument } from './entities/budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<BudgetDocument>,
  ) {}

  async create(createBudgetDto: CreateBudgetDto) {
    const record = await this.budgetModel.create(createBudgetDto);
    return {
      message: 'BUDGET.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.budgetModel
      .find()
      .populate('createdBy')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.budgetModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'BUDGET.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'BUDGET.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.budgetModel
      .findById(id)
      .populate('createdBy')
      .exec();
    if (!record) {
      throw new NotFoundException('BUDGET.NOT_FOUND');
    }
    return {
      message: 'BUDGET.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    const record = await this.budgetModel
      .findByIdAndUpdate(id, updateBudgetDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('BUDGET.NOT_FOUND');
    }
    return {
      message: 'BUDGET.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.budgetModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('BUDGET.NOT_FOUND');
    }
    return {
      message: 'BUDGET.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
