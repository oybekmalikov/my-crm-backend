import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHomeworkDataDto } from './dto/create-homework-data.dto';
import { UpdateHomeworkDataDto } from './dto/update-homework-data.dto';
import { HomeworkData, HomeworkDataDocument } from './entities/homework-data.entity';

@Injectable()
export class HomeworkDatasService {
  constructor(
    @InjectModel(HomeworkData.name) private homeworkDataModel: Model<HomeworkDataDocument>,
  ) {}

  async create(createHomeworkDataDto: CreateHomeworkDataDto) {
    const homeworkData = await this.homeworkDataModel.create(createHomeworkDataDto);
    return {
      message: 'HOMEWORK_DATA.CREATED',
      data: homeworkData,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.homeworkDataModel
      .find()
      .populate('homeworkId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.homeworkDataModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'HOMEWORK_DATA.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'HOMEWORK_DATA.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const homeworkData = await this.homeworkDataModel
      .findById(id)
      .populate('homeworkId')
      .exec();
    if (!homeworkData) {
      throw new NotFoundException('HOMEWORK_DATA.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK_DATA.FOUND',
      data: homeworkData,
      success: true,
    };
  }

  async update(id: string, updateHomeworkDataDto: UpdateHomeworkDataDto) {
    const homeworkData = await this.homeworkDataModel
      .findByIdAndUpdate(id, updateHomeworkDataDto, { new: true })
      .exec();
    if (!homeworkData) {
      throw new NotFoundException('HOMEWORK_DATA.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK_DATA.UPDATED',
      data: homeworkData,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.homeworkDataModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('HOMEWORK_DATA.NOT_FOUND');
    }
    return {
      message: 'HOMEWORK_DATA.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
