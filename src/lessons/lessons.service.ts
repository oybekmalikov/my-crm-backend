import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson, LessonDocument } from './entities/lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    const lesson = await this.lessonModel.create(createLessonDto);
    return {
      message: 'LESSON.CREATED',
      data: lesson,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.lessonModel
      .find()
      .populate('groupId')
      .populate('roomId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.lessonModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'LESSON.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'LESSON.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const lesson = await this.lessonModel.findById(id).populate('groupId').populate('roomId').exec();
    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.FOUND',
      data: lesson,
      success: true,
    };
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonModel
      .findByIdAndUpdate(id, updateLessonDto, { new: true })
      .exec();
    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.UPDATED',
      data: lesson,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.lessonModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
