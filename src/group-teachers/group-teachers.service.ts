import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupTeacherDto } from './dto/create-group-teacher.dto';
import { UpdateGroupTeacherDto } from './dto/update-group-teacher.dto';
import { GroupTeacher, GroupTeacherDocument } from './entities/group-teacher.entity';

@Injectable()
export class GroupTeachersService {
  constructor(
    @InjectModel(GroupTeacher.name) private groupTeacherModel: Model<GroupTeacherDocument>,
  ) {}

  async create(createGroupTeacherDto: CreateGroupTeacherDto) {
    const groupTeacher = await this.groupTeacherModel.create(createGroupTeacherDto);
    return {
      message: 'GROUP_TEACHER.CREATED',
      data: groupTeacher,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.groupTeacherModel
      .find()
      .populate('groupId')
      .populate('teacherId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.groupTeacherModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'GROUP_TEACHER.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'GROUP_TEACHER.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const groupTeacher = await this.groupTeacherModel.findById(id).populate('groupId').populate('teacherId').exec();
    if (!groupTeacher) {
      throw new NotFoundException('GROUP_TEACHER.NOT_FOUND');
    }
    return {
      message: 'GROUP_TEACHER.FOUND',
      data: groupTeacher,
      success: true,
    };
  }

  async update(id: string, updateGroupTeacherDto: UpdateGroupTeacherDto) {
    const groupTeacher = await this.groupTeacherModel
      .findByIdAndUpdate(id, updateGroupTeacherDto, { new: true })
      .exec();
    if (!groupTeacher) {
      throw new NotFoundException('GROUP_TEACHER.NOT_FOUND');
    }
    return {
      message: 'GROUP_TEACHER.UPDATED',
      data: groupTeacher,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.groupTeacherModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('GROUP_TEACHER.NOT_FOUND');
    }
    return {
      message: 'GROUP_TEACHER.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
