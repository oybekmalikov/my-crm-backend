import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';
import { HomeworkResult, HomeworkResultDocument } from './entities/homework-result.entity';

@Injectable()
export class HomeworkResultsService {
  constructor(
    @InjectModel(HomeworkResult.name) private homeworkResultModel: Model<HomeworkResultDocument>,
  ) {}

  async create(createHomeworkResultDto: CreateHomeworkResultDto) {
    const homeworkResult = await this.homeworkResultModel.create(createHomeworkResultDto);
    return {
      message: 'HOMEWORK_RESULT.CREATED',
      data: homeworkResult,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.homeworkResultModel
      .find()
      .populate('studentHomeworkId')
      .populate('homeworkId')
      .populate('teacherId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.homeworkResultModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'HOMEWORK_RESULT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'HOMEWORK_RESULT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const homeworkResult = await this.homeworkResultModel
      .findById(id)
      .populate('studentHomeworkId')
      .populate('homeworkId')
      .populate('teacherId')
      .exec();
    if (!homeworkResult) {
      throw new NotFoundException('HOMEWORK_RESULT.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK_RESULT.FOUND',
      data: homeworkResult,
      success: true,
    };
  }

  async update(id: string, updateHomeworkResultDto: UpdateHomeworkResultDto) {
    const homeworkResult = await this.homeworkResultModel
      .findByIdAndUpdate(id, updateHomeworkResultDto, { new: true })
      .exec();
    if (!homeworkResult) {
      throw new NotFoundException('HOMEWORK_RESULT.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK_RESULT.UPDATED',
      data: homeworkResult,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.homeworkResultModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('HOMEWORK_RESULT.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK_RESULT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
