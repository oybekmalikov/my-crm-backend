import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExamResultDto } from './dto/create-exam-result.dto';
import { UpdateExamResultDto } from './dto/update-exam-result.dto';
import { ExamResult, ExamResultDocument } from './entities/exam-result.entity';

@Injectable()
export class ExamResultsService {
  constructor(
    @InjectModel(ExamResult.name) private examResultModel: Model<ExamResultDocument>,
  ) {}

  async create(createExamResultDto: CreateExamResultDto) {
    const examResult = await this.examResultModel.create(createExamResultDto);
    return {
      message: 'EXAM_RESULT.CREATED',
      data: examResult,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.examResultModel
      .find()
      .populate('examId')
      .populate('workId')
      .populate('teacherId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.examResultModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'EXAM_RESULT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'EXAM_RESULT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const examResult = await this.examResultModel
      .findById(id)
      .populate('examId')
      .populate('workId')
      .populate('teacherId')
      .exec();
    if (!examResult) {
      throw new NotFoundException('EXAM_RESULT.NOT_FOUND');
    }
    return {
      message: 'EXAM_RESULT.FOUND',
      data: examResult,
      success: true,
    };
  }

  async update(id: string, updateExamResultDto: UpdateExamResultDto) {
    const examResult = await this.examResultModel
      .findByIdAndUpdate(id, updateExamResultDto, { new: true })
      .exec();
    if (!examResult) {
      throw new NotFoundException('EXAM_RESULT.NOT_FOUND');
    }
    return {
      message: 'EXAM_RESULT.UPDATED',
      data: examResult,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.examResultModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('EXAM_RESULT.NOT_FOUND');
    }
    return {
      message: 'EXAM_RESULT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
