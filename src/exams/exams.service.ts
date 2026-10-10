import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamDocument } from './entities/exam.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
  ) {}

  async create(createExamDto: CreateExamDto) {
    const exam = await this.examModel.create(createExamDto);
    return {
      message: 'EXAM.CREATED',
      data: exam,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.examModel
      .find()
      .populate('groupId')
      .populate('taskId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.examModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'EXAM.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'EXAM.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const exam = await this.examModel
      .findById(id)
      .populate('groupId')
      .populate('taskId')
      .exec();
    if (!exam) {
      throw new NotFoundException('EXAM.NOT_FOUND');
    }
    return {
      message: 'EXAM.FOUND',
      data: exam,
      success: true,
    };
  }

  async update(id: string, updateExamDto: UpdateExamDto) {
    const exam = await this.examModel
      .findByIdAndUpdate(id, updateExamDto, { new: true })
      .exec();
    if (!exam) {
      throw new NotFoundException('EXAM.NOT_FOUND');
    }
    return {
      message: 'EXAM.UPDATED',
      data: exam,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.examModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('EXAM.NOT_FOUND');
    }
    return {
      message: 'EXAM.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
