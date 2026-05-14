import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract, ContractDocument } from './entities/contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
  ) {}

  async create(createContractDto: CreateContractDto) {
    const record = await this.contractModel.create(createContractDto);
    return {
      message: 'CONTRACT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.contractModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.contractModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'CONTRACT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'CONTRACT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.contractModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException('CONTRACT.NOT_FOUND');
    }
    return {
      message: 'CONTRACT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateContractDto: UpdateContractDto) {
    const record = await this.contractModel
      .findByIdAndUpdate(id, updateContractDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('CONTRACT.NOT_FOUND');
    }
    return {
      message: 'CONTRACT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.contractModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('CONTRACT.NOT_FOUND');
    }
    return {
      message: 'CONTRACT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
