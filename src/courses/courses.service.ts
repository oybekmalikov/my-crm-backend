import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = await this.courseModel.create(createCourseDto);
    return {
      message: 'COURSE.CREATED',
      data: course,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.courseModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.courseModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'COURSE.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'COURSE.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }
    return {
      message: 'COURSE.FOUND',
      data: course,
      success: true,
    };
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .exec();
    if (!course) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }
    return {
      message: 'COURSE.UPDATED',
      data: course,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.courseModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('COURSE.NOT_FOUND');
    }
    return {
      message: 'COURSE.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
