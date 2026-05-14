import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance, AttendanceDocument } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const attendance = await this.attendanceModel.create(createAttendanceDto);
    return {
      message: 'ATTENDANCE.CREATED',
      data: attendance,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.attendanceModel
      .find()
      .populate('groupId')
      .populate('studentId')
      .populate('lessonId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.attendanceModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'ATTENDANCE.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'ATTENDANCE.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const attendance = await this.attendanceModel
      .findById(id)
      .populate('groupId')
      .populate('studentId')
      .populate('lessonId')
      .exec();
    if (!attendance) {
      throw new NotFoundException('ATTENDANCE.NOT_FOUND');
    }
    return {
      message: 'ATTENDANCE.FOUND',
      data: attendance,
      success: true,
    };
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const attendance = await this.attendanceModel
      .findByIdAndUpdate(id, updateAttendanceDto, { new: true })
      .exec();
    if (!attendance) {
      throw new NotFoundException('ATTENDANCE.NOT_FOUND');
    }
    return {
      message: 'ATTENDANCE.UPDATED',
      data: attendance,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.attendanceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('ATTENDANCE.NOT_FOUND');
    }
    return {
      message: 'ATTENDANCE.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
