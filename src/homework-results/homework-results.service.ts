import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudentsService } from '../students/students.service';
import {
  StudentHomework,
  StudentHomeworkDocument,
} from '../student-homeworks/entities/student-homework.entity';
import { CreateHomeworkResultDto } from './dto/create-homework-result.dto';
import { UpdateHomeworkResultDto } from './dto/update-homework-result.dto';
import { HomeworkResult, HomeworkResultDocument } from './entities/homework-result.entity';

@Injectable()
export class HomeworkResultsService {
  constructor(
    @InjectModel(HomeworkResult.name) private homeworkResultModel: Model<HomeworkResultDocument>,
    @InjectModel(StudentHomework.name) private studentHomeworkModel: Model<StudentHomeworkDocument>,
    private readonly studentsService: StudentsService,
  ) {}

  async create(createHomeworkResultDto: CreateHomeworkResultDto) {
    const homeworkResult = await this.homeworkResultModel.create(createHomeworkResultDto);
    await this.postResultActions(createHomeworkResultDto.studentHomeworkId, homeworkResult.mark, homeworkResult.status);
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
    await this.postResultActions(
      homeworkResult.studentHomeworkId.toString(),
      homeworkResult.mark,
      homeworkResult.status,
    );
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

  private async postResultActions(
    studentHomeworkId: string,
    mark: number,
    status: string,
  ) {
    const sh = await this.studentHomeworkModel.findById(studentHomeworkId).exec();
    if (!sh) return;

    const studentId = sh.studentId.toString();
    await this.studentsService.recalculateAverageMark(studentId);

    if (status === 'accepted' && mark >= 80) {
      const xpBonus = mark >= 95 ? 50 : mark >= 90 ? 30 : 15;
      await this.studentsService.updateXP_Points(studentId, xpBonus, 0, 'homework');
    }
  }
}
