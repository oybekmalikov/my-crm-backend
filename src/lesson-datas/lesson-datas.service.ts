import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDataDto } from './dto/create-lesson-data.dto';
import { UpdateLessonDataDto } from './dto/update-lesson-data.dto';
import { LessonData, LessonDataDocument } from './entities/lesson-data.entity';

@Injectable()
export class LessonDatasService {
  constructor(
    @InjectModel(LessonData.name) private lessonDataModel: Model<LessonDataDocument>,
  ) {}

  async create(createLessonDataDto: CreateLessonDataDto) {
    const lessonData = await this.lessonDataModel.create(createLessonDataDto);
    return {
      message: 'LESSON_DATA.CREATED',
      data: lessonData,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.lessonDataModel
      .find()
      .populate('lessonId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.lessonDataModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'LESSON_DATA.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'LESSON_DATA.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const lessonData = await this.lessonDataModel.findById(id).populate('lessonId').exec();
    if (!lessonData) {
      throw new NotFoundException('LESSON_DATA.NOT_FOUND');
    }
    return {
      message: 'LESSON_DATA.FOUND',
      data: lessonData,
      success: true,
    };
  }

  async update(id: string, updateLessonDataDto: UpdateLessonDataDto) {
    const lessonData = await this.lessonDataModel
      .findByIdAndUpdate(id, updateLessonDataDto, { new: true })
      .exec();
    if (!lessonData) {
      throw new NotFoundException('LESSON_DATA.NOT_FOUND');
    }
    return {
      message: 'LESSON_DATA.UPDATED',
      data: lessonData,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.lessonDataModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('LESSON_DATA.NOT_FOUND');
    }
    return {
      message: 'LESSON_DATA.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
