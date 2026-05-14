import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupStudentDto } from './dto/create-group-student.dto';
import { UpdateGroupStudentDto } from './dto/update-group-student.dto';
import { GroupStudent, GroupStudentDocument } from './entities/group-student.entity';

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectModel(GroupStudent.name) private groupStudentModel: Model<GroupStudentDocument>,
  ) {}

  async create(createGroupStudentDto: CreateGroupStudentDto) {
    const groupStudent = await this.groupStudentModel.create(createGroupStudentDto);
    return {
      message: 'GROUP_STUDENT.CREATED',
      data: groupStudent,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.groupStudentModel
      .find()
      .populate('groupId')
      .populate('studentId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.groupStudentModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'GROUP_STUDENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'GROUP_STUDENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const groupStudent = await this.groupStudentModel.findById(id).populate('groupId').populate('studentId').exec();
    if (!groupStudent) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }
    return {
      message: 'GROUP_STUDENT.FOUND',
      data: groupStudent,
      success: true,
    };
  }

  async update(id: string, updateGroupStudentDto: UpdateGroupStudentDto) {
    const groupStudent = await this.groupStudentModel
      .findByIdAndUpdate(id, updateGroupStudentDto, { new: true })
      .exec();
    if (!groupStudent) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }
    return {
      message: 'GROUP_STUDENT.UPDATED',
      data: groupStudent,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.groupStudentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('GROUP_STUDENT.NOT_FOUND');
    }
    return {
      message: 'GROUP_STUDENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
