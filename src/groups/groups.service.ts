import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, GroupDocument } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const group = await this.groupModel.create(createGroupDto);
    return {
      message: 'GROUP.CREATED',
      data: group,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.groupModel
      .find()
      .populate('courseId')
      .populate('branchId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.groupModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'GROUP.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'GROUP.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const group = await this.groupModel.findById(id).populate('courseId').populate('branchId').exec();
    if (!group) {
      throw new NotFoundException('GROUP.NOT_FOUND');
    }
    return {
      message: 'GROUP.FOUND',
      data: group,
      success: true,
    };
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .exec();
    if (!group) {
      throw new NotFoundException('GROUP.NOT_FOUND');
    }
    return {
      message: 'GROUP.UPDATED',
      data: group,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.groupModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('GROUP.NOT_FOUND');
    }
    return {
      message: 'GROUP.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
