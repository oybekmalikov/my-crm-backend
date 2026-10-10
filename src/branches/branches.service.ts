import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, BranchDocument } from './entities/branch.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branch = await this.branchModel.create(createBranchDto);
    return {
      message: 'BRANCH.CREATED',
      data: branch,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.branchModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.branchModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'BRANCH.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'BRANCH.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new NotFoundException('BRANCH.NOT_FOUND');
    }
    return {
      message: 'BRANCH.FOUND',
      data: branch,
      success: true,
    };
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchModel
      .findByIdAndUpdate(id, updateBranchDto, { new: true })
      .exec();
    if (!branch) {
      throw new NotFoundException('BRANCH.NOT_FOUND');
    }
    return {
      message: 'BRANCH.UPDATED',
      data: branch,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.branchModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('BRANCH.NOT_FOUND');
    }
    return {
      message: 'BRANCH.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
