import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentWorkingDto } from './dto/create-student-working.dto';
import { UpdateStudentWorkingDto } from './dto/update-student-working.dto';
import { StudentWorking, StudentWorkingDocument } from './entities/student-working.entity';

@Injectable()
export class StudentsWorkingService {
  constructor(
    @InjectModel(StudentWorking.name) private studentWorkingModel: Model<StudentWorkingDocument>,
  ) {}

  async create(createStudentWorkingDto: CreateStudentWorkingDto) {
    const studentWorking = await this.studentWorkingModel.create(createStudentWorkingDto);
    return {
      message: 'STUDENTS_WORKING.CREATED',
      data: studentWorking,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentWorkingModel
      .find()
      .populate('completedId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentWorkingModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'STUDENTS_WORKING.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENTS_WORKING.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const studentWorking = await this.studentWorkingModel
      .findById(id)
      .populate('completedId')
      .exec();
    if (!studentWorking) {
      throw new NotFoundException('STUDENTS_WORKING.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_WORKING.FOUND',
      data: studentWorking,
      success: true,
    };
  }

  async update(id: string, updateStudentWorkingDto: UpdateStudentWorkingDto) {
    const studentWorking = await this.studentWorkingModel
      .findByIdAndUpdate(id, updateStudentWorkingDto, { new: true })
      .exec();
    if (!studentWorking) {
      throw new NotFoundException('STUDENTS_WORKING.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_WORKING.UPDATED',
      data: studentWorking,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentWorkingModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENTS_WORKING.NOT_FOUND');
    }
    return {
      message: 'STUDENTS_WORKING.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
