import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseCompletedStudentDto } from './dto/create-course-completed-student.dto';
import { UpdateCourseCompletedStudentDto } from './dto/update-course-completed-student.dto';
import { CourseCompletedStudent, CourseCompletedStudentDocument } from './entities/course-completed-student.entity';

@Injectable()
export class CourseCompletedStudentsService {
  constructor(
    @InjectModel(CourseCompletedStudent.name) private courseCompletedStudentModel: Model<CourseCompletedStudentDocument>,
  ) {}

  async create(createCourseCompletedStudentDto: CreateCourseCompletedStudentDto) {
    const record = await this.courseCompletedStudentModel.create(createCourseCompletedStudentDto);
    return {
      message: 'COURSE_COMPLETED_STUDENT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.courseCompletedStudentModel
      .find()
      .populate('studentId')
      .populate('completedGroupId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.courseCompletedStudentModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'COURSE_COMPLETED_STUDENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'COURSE_COMPLETED_STUDENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.courseCompletedStudentModel
      .findById(id)
      .populate('studentId')
      .populate('completedGroupId')
      .exec();
    if (!record) {
      throw new NotFoundException('COURSE_COMPLETED_STUDENT.NOT_FOUND');
    }
    return {
      message: 'COURSE_COMPLETED_STUDENT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateCourseCompletedStudentDto: UpdateCourseCompletedStudentDto) {
    const record = await this.courseCompletedStudentModel
      .findByIdAndUpdate(id, updateCourseCompletedStudentDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('COURSE_COMPLETED_STUDENT.NOT_FOUND');
    }
    return {
      message: 'COURSE_COMPLETED_STUDENT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.courseCompletedStudentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('COURSE_COMPLETED_STUDENT.NOT_FOUND');
    }
    return {
      message: 'COURSE_COMPLETED_STUDENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
