import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './entities/lead.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const record = await this.leadModel.create(createLeadDto);
    return {
      message: 'LEAD.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.leadModel
      .find()
      .populate('courseId')
      .populate('assignedTo')
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();
    const total = await this.leadModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'LEAD.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'LEAD.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.leadModel
      .findById(id)
      .populate('courseId')
      .populate('assignedTo')
      .exec();
    if (!record) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }
    return {
      message: 'LEAD.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const record = await this.leadModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }
    return {
      message: 'LEAD.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('LEAD.NOT_FOUND');
    }
    return {
      message: 'LEAD.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
