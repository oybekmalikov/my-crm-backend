import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBudgetCategoryDto, UpdateBudgetCategoryDto } from './dto/budget-category.dto';
import { BudgetCategory, BudgetCategoryDocument } from './entities/budget-category.entity';

@Injectable()
export class BudgetCategoriesService {
  constructor(
    @InjectModel(BudgetCategory.name) private categoryModel: Model<BudgetCategoryDocument>,
  ) {}

  async create(createBudgetCategoryDto: CreateBudgetCategoryDto) {
    const category = await this.categoryModel.create(createBudgetCategoryDto);
    return {
      message: 'BUDGET_CATEGORY.CREATED',
      data: category,
      success: true,
    };
  }

  async findAll() {
    const data = await this.categoryModel.find().exec();
    return {
      message: 'BUDGET_CATEGORY.LIST',
      data,
      success: true,
    };
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException('BUDGET_CATEGORY.NOT_FOUND');
    return {
      message: 'BUDGET_CATEGORY.FOUND',
      data: category,
      success: true,
    };
  }

  async update(id: string, updateBudgetCategoryDto: UpdateBudgetCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(id, updateBudgetCategoryDto, { new: true }).exec();
    if (!category) throw new NotFoundException('BUDGET_CATEGORY.NOT_FOUND');
    return {
      message: 'BUDGET_CATEGORY.UPDATED',
      data: category,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('BUDGET_CATEGORY.NOT_FOUND');
    return {
      message: 'BUDGET_CATEGORY.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
