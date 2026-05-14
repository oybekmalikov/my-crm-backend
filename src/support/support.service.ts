import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { Support, SupportDocument } from './entities/support.entity';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name) private supportModel: Model<SupportDocument>,
  ) {}

  async create(createSupportDto: CreateSupportDto) {
    const support = await this.supportModel.create(createSupportDto);
    return {
      message: 'SUPPORT.CREATED',
      data: support,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1, userId?: string) {
    const skip = (page - 1) * limit;
    const query = userId ? { $or: [{ senderId: userId }, { reciptId: userId }] } : {};
    const data = await this.supportModel
      .find(query)
      .populate('senderUser')
      .populate('reciptUser')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.supportModel.countDocuments(query);

    if (data.length === 0) {
      return {
        message: 'SUPPORT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'SUPPORT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const support = await this.supportModel
      .findById(id)
      .populate('senderUser')
      .populate('reciptUser')
      .exec();
    if (!support) {
      throw new NotFoundException('SUPPORT.NOT_FOUND');
    }
    return {
      message: 'SUPPORT.FOUND',
      data: support,
      success: true,
    };
  }

  async update(id: string, updateSupportDto: UpdateSupportDto) {
    const current = await this.supportModel.findById(id).exec();
    if (!current) {
      throw new NotFoundException('SUPPORT.NOT_FOUND');
    }

    if (updateSupportDto.content && updateSupportDto.content !== current.content) {
      current.originalContent = current.content;
      current.isEdited = true;
      current.content = updateSupportDto.content;
    }

    if (updateSupportDto.imageUrl) {
      current.imageUrl = updateSupportDto.imageUrl;
    }

    const support = await current.save();

    return {
      message: 'SUPPORT.UPDATED',
      data: support,
      success: true,
    };
  }

  async markAsViewed(id: string) {
    const support = await this.supportModel
      .findByIdAndUpdate(id, { isViewed: true }, { new: true })
      .exec();
    if (!support) {
      throw new NotFoundException('SUPPORT.NOT_FOUND');
    }
    return {
      message: 'SUPPORT.MARKED_AS_VIEWED',
      data: support,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.supportModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
    if (!deleted) {
      throw new NotFoundException('SUPPORT.NOT_FOUND');
    }
    return {
      message: 'SUPPORT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
