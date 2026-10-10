import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoursePlanDto } from './dto/create-course-plan.dto';
import { UpdateCoursePlanDto } from './dto/update-course-plan.dto';
import { CoursePlan, CoursePlanDocument } from './entities/course-plan.entity';

@Injectable()
export class CoursePlansService {
  constructor(
    @InjectModel(CoursePlan.name) private coursePlanModel: Model<CoursePlanDocument>,
  ) {}

  async create(createCoursePlanDto: CreateCoursePlanDto) {
    const record = await this.coursePlanModel.create(createCoursePlanDto);
    return {
      message: 'COURSE_PLAN.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.coursePlanModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.coursePlanModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'COURSE_PLAN.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'COURSE_PLAN.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.coursePlanModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException('COURSE_PLAN.NOT_FOUND');
    }
    return {
      message: 'COURSE_PLAN.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateCoursePlanDto: UpdateCoursePlanDto) {
    const record = await this.coursePlanModel
      .findByIdAndUpdate(id, updateCoursePlanDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('COURSE_PLAN.NOT_FOUND');
    }
    return {
      message: 'COURSE_PLAN.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.coursePlanModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('COURSE_PLAN.NOT_FOUND');
    }
    return {
      message: 'COURSE_PLAN.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
