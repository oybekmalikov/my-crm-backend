import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupStudent, GroupStudentDocument } from '../group-students/entities/group-student.entity';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import { StudentHomework, StudentHomeworkDocument } from '../student-homeworks/entities/student-homework.entity';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { Homework, HomeworkDocument } from './entities/homework.entity';

@Injectable()
export class HomeworksService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(GroupStudent.name) private groupStudentModel: Model<GroupStudentDocument>,
    @InjectModel(StudentHomework.name) private studentHomeworkModel: Model<StudentHomeworkDocument>,
  ) {}

  private enrichWithOverdue(homework: HomeworkDocument) {
    const obj = homework.toObject();
    return { ...obj, isOverdue: new Date() > new Date(homework.deadline) };
  }

  async create(createHomeworkDto: CreateHomeworkDto) {
    const homework = await this.homeworkModel.create(createHomeworkDto);
    await this.createDefaultStudentHomeworks(homework);
    return {
      message: 'HOMEWORK.CREATED',
      data: this.enrichWithOverdue(homework),
      success: true,
    };
  }

  /** Create empty StudentHomework records for all studying students in the lesson's group. */
  private async createDefaultStudentHomeworks(homework: HomeworkDocument) {
    const lesson = await this.lessonModel.findById(homework.lessonId).exec();
    if (!lesson) return;

    const students = await this.groupStudentModel
      .find({ groupId: lesson.groupId, status: 'studying' })
      .exec();

    const toCreate: Array<{ studentId: string; homeworkId: string; description: string }> = [];
    for (const gs of students) {
      const exists = await this.studentHomeworkModel.findOne({
        studentId: gs.studentId.toString(),
        homeworkId: homework._id.toString(),
      }).exec();
      if (!exists) {
        toCreate.push({
          studentId: gs.studentId.toString(),
          homeworkId: homework._id.toString(),
          description: '',
        });
      }
    }

    if (toCreate.length > 0) {
      await this.studentHomeworkModel.insertMany(toCreate);
    }
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
      data: { data: data.map((h) => this.enrichWithOverdue(h)), total, page, limit },
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
      data: this.enrichWithOverdue(homework),
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
      data: this.enrichWithOverdue(homework),
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
