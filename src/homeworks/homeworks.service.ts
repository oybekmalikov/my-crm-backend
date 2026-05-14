import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { Homework, HomeworkDocument } from './entities/homework.entity';

@Injectable()
export class HomeworksService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
  ) {}

  async create(createHomeworkDto: CreateHomeworkDto) {
    const homework = await this.homeworkModel.create(createHomeworkDto);
    return {
      message: 'HOMEWORK.CREATED',
      data: homework,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.homeworkModel
      .find()
      .populate('lessonId')
      .populate('teacherId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.homeworkModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'HOMEWORK.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'HOMEWORK.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const homework = await this.homeworkModel
      .findById(id)
      .populate('lessonId')
      .populate('teacherId')
      .exec();
    if (!homework) {
      throw new NotFoundException('HOMEWORK.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK.FOUND',
      data: homework,
      success: true,
    };
  }

  async update(id: string, updateHomeworkDto: UpdateHomeworkDto) {
    const homework = await this.homeworkModel
      .findByIdAndUpdate(id, updateHomeworkDto, { new: true })
      .exec();
    if (!homework) {
      throw new NotFoundException('HOMEWORK.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK.UPDATED',
      data: homework,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.homeworkModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('HOMEWORK.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
