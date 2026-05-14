import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { STUDENT_POINTS_LEVELS, STUDENT_XP_LEVELS } from '../app.constants';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student, StudentDocument } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.studentModel.create(createStudentDto);
    return {
      message: 'STUDENT.CREATED',
      data: student,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentModel.countDocuments();
    if (data.length === 0) {
      return {
        message: 'STUDENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
        message: 'STUDENT.LIST_FOUND',
      data: { students: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .populate('user')
      .exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
        message: 'STUDENT.FOUND',
      data: student,
      success: true,
    };
  }

  async findOneByUserId(userId: string) {
    const student = await this.studentModel
      .findOne({ userId })
      .populate('user')
      .exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
        message: 'STUDENT.FOUND',
      data: student,
      success: true,
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const updated = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
        message: 'STUDENT.UPDATED',
      data: updated,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
        message: 'STUDENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async updateXP_Points(
    id: string,
    added_xp: number = 0,
    added_point: number = 0,
  ) {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    const { level, xp, point } = student;
    if (STUDENT_XP_LEVELS[level] > xp + added_xp) {
      if (added_point === 0) {
        await this.studentModel
          .findByIdAndUpdate(id, {
            level: level + 1,
            xp: xp + added_xp,
            point: STUDENT_POINTS_LEVELS[level] * xp,
          })
          .exec();
      } else {
        await this.studentModel
          .findByIdAndUpdate(id, {
            level: level + 1,
            xp: xp + added_xp,
            point: point + added_point,
          })
          .exec();
      }
    } else {
      if (added_point === 0) {
        await this.studentModel
          .findByIdAndUpdate(id, {
            xp: xp + added_xp,
            point: STUDENT_POINTS_LEVELS[level] * xp,
          })
          .exec();
      } else {
        await this.studentModel
          .findByIdAndUpdate(id, {
            xp: xp + added_xp,
            point: point + added_point,
          })
          .exec();
      }
    }
    return {
        message: 'STUDENT.XP_POINTS_UPDATED',
      data: await this.studentModel.findById(id).exec(),
      success: true,
    };
  }
}
