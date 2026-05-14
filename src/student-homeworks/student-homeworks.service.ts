import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentHomeworkDto } from './dto/create-student-homework.dto';
import { UpdateStudentHomeworkDto } from './dto/update-student-homework.dto';
import { StudentHomework, StudentHomeworkDocument } from './entities/student-homework.entity';

@Injectable()
export class StudentHomeworksService {
  constructor(
    @InjectModel(StudentHomework.name) private studentHomeworkModel: Model<StudentHomeworkDocument>,
  ) {}

  async create(createStudentHomeworkDto: CreateStudentHomeworkDto) {
    const studentHomework = await this.studentHomeworkModel.create(createStudentHomeworkDto);
    return {
      message: 'STUDENT_HOMEWORK.CREATED',
      data: studentHomework,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentHomeworkModel
      .find()
      .populate('studentId')
      .populate('homeworkId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentHomeworkModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'STUDENT_HOMEWORK.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENT_HOMEWORK.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const studentHomework = await this.studentHomeworkModel
      .findById(id)
      .populate('studentId')
      .populate('homeworkId')
      .exec();
    if (!studentHomework) {
      throw new NotFoundException('STUDENT_HOMEWORK.NOT_FOUND');
    }
    return {
      message: 'STUDENT_HOMEWORK.FOUND',
      data: studentHomework,
      success: true,
    };
  }

  async update(id: string, updateStudentHomeworkDto: UpdateStudentHomeworkDto) {
    const studentHomework = await this.studentHomeworkModel
      .findByIdAndUpdate(id, updateStudentHomeworkDto, { new: true })
      .exec();
    if (!studentHomework) {
      throw new NotFoundException('STUDENT_HOMEWORK.NOT_FOUND');
    }
    return {
      message: 'STUDENT_HOMEWORK.UPDATED',
      data: studentHomework,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentHomeworkModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENT_HOMEWORK.NOT_FOUND');
    }
    return {
      message: 'STUDENT_HOMEWORK.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
