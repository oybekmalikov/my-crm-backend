import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentHomeworkDataDto } from './dto/create-student-homework-data.dto';
import { UpdateStudentHomeworkDataDto } from './dto/update-student-homework-data.dto';
import { StudentHomeworkData, StudentHomeworkDataDocument } from './entities/student-homework-data.entity';

@Injectable()
export class StudentHomeworkDatasService {
  constructor(
    @InjectModel(StudentHomeworkData.name) private studentHomeworkDataModel: Model<StudentHomeworkDataDocument>,
  ) {}

  async create(createStudentHomeworkDataDto: CreateStudentHomeworkDataDto) {
    const studentHomeworkData = await this.studentHomeworkDataModel.create(createStudentHomeworkDataDto);
    return {
      message: 'STUDENT_HOMEWORK_DATA.CREATED',
      data: studentHomeworkData,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentHomeworkDataModel
      .find()
      .populate('studentHomeworkId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentHomeworkDataModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'STUDENT_HOMEWORK_DATA.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENT_HOMEWORK_DATA.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const studentHomeworkData = await this.studentHomeworkDataModel
      .findById(id)
      .populate('studentHomeworkId')
      .exec();
    if (!studentHomeworkData) {
      throw new NotFoundException('STUDENT_HOMEWORK_DATA.NOT_FOUND');
    }
    return {
      message: 'STUDENT_HOMEWORK_DATA.FOUND',
      data: studentHomeworkData,
      success: true,
    };
  }

  async update(id: string, updateStudentHomeworkDataDto: UpdateStudentHomeworkDataDto) {
    const studentHomeworkData = await this.studentHomeworkDataModel
      .findByIdAndUpdate(id, updateStudentHomeworkDataDto, { new: true })
      .exec();
    if (!studentHomeworkData) {
      throw new NotFoundException('STUDENT_HOMEWORK_DATA.NOT_FOUND');
    }
    return {
      message: 'STUDENT_HOMEWORK_DATA.UPDATED',
      data: studentHomeworkData,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentHomeworkDataModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENT_HOMEWORK_DATA.NOT_FOUND');
    }
    return {
      message: 'STUDENT_HOMEWORK_DATA.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
