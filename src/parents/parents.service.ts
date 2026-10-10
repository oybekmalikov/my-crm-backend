import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from '../attendance/entities/attendance.entity';
import { HomeworkResult, HomeworkResultDocument } from '../homework-results/entities/homework-result.entity';
import { StudentPayment, StudentPaymentDocument } from '../student-payments/entities/student-payment.entity';
import { StudentHomework, StudentHomeworkDocument } from '../student-homeworks/entities/student-homework.entity';
import { UsersService } from '../users/users.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent, ParentDocument } from './entities/parent.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<ParentDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(StudentHomework.name) private studentHomeworkModel: Model<StudentHomeworkDocument>,
    @InjectModel(HomeworkResult.name) private homeworkResultModel: Model<HomeworkResultDocument>,
    @InjectModel(StudentPayment.name) private studentPaymentModel: Model<StudentPaymentDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateParentDto) {
    const userResult = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      middleName: dto.middleName ?? '',
      login: dto.login,
      password: dto.password,
      phone: dto.phone,
      email: dto.email,
      role: 'PARENT',
    });

    const parent = await this.parentModel.create({
      userId: userResult.data._id.toString(),
      studentIds: dto.studentIds ?? [],
      isActive: true,
    });

    return {
      message: 'PARENT.CREATED',
      data: { parent, user: userResult.data },
      success: true,
    };
  }

  async findAll(limit = 20, page = 1) {
    const skip = (page - 1) * limit;
    const data = await this.parentModel
      .find()
      .populate('userId')
      .populate('studentIds')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.parentModel.countDocuments();

    return {
      message: 'PARENT.LIST',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const parent = await this.parentModel
      .findById(id)
      .populate('userId')
      .populate('studentIds')
      .exec();
    if (!parent) throw new NotFoundException('PARENT.NOT_FOUND');

    return {
      message: 'PARENT.FOUND',
      data: parent,
      success: true,
    };
  }

  async update(id: string, dto: UpdateParentDto) {
    const parent = await this.parentModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!parent) throw new NotFoundException('PARENT.NOT_FOUND');

    return {
      message: 'PARENT.UPDATED',
      data: parent,
      success: true,
    };
  }

  async addStudent(parentId: string, studentId: string) {
    const parent = await this.parentModel.findById(parentId).exec();
    if (!parent) throw new NotFoundException('PARENT.NOT_FOUND');

    const current = new Set((parent.studentIds ?? []).map((s) => s.toString()));
    current.add(studentId);
    parent.studentIds = [...current];
    await parent.save();

    return {
      message: 'PARENT.STUDENT_LINKED',
      data: parent,
      success: true,
    };
  }

  async getWeeklyReport(parentId: string) {
    const parent = await this.parentModel.findById(parentId).exec();
    if (!parent) throw new NotFoundException('PARENT.NOT_FOUND');

    const studentIds = (parent.studentIds ?? []).map((s) => s.toString());
    if (studentIds.length === 0) {
      return { message: 'PARENT.WEEKLY_REPORT', data: { students: [] }, success: true };
    }

    const since = new Date();
    since.setDate(since.getDate() - 7);

    const attendance = await this.attendanceModel
      .find({ studentId: { $in: studentIds }, createdAt: { $gte: since } })
      .exec();

    const studentHomeworks = await this.studentHomeworkModel
      .find({ studentId: { $in: studentIds }, createdAt: { $gte: since } })
      .select('_id studentId')
      .exec();
    const shIds = studentHomeworks.map((s) => s._id.toString());

    const homeworkResults = shIds.length
      ? await this.homeworkResultModel.find({ studentHomeworkId: { $in: shIds } }).exec()
      : [];

    const payments = await this.studentPaymentModel
      .find({ createdAt: { $gte: since } })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();

    return {
      message: 'PARENT.WEEKLY_REPORT',
      data: {
        period: { from: since, to: new Date() },
        attendance: {
          total: attendance.length,
          present: attendance.filter((a) => a.status === 'present').length,
          absent: attendance.filter((a) => a.status === 'absent').length,
        },
        homework: {
          submissions: studentHomeworks.length,
          checked: homeworkResults.length,
          avgMark: homeworkResults.length
            ? Number((homeworkResults.reduce((sum, r) => sum + (r.mark ?? 0), 0) / homeworkResults.length).toFixed(2))
            : 0,
        },
        payments: {
          recent: payments.slice(0, 20),
          completedCount: payments.filter((p) => p.status === 'completed').length,
          overdueCount: payments.filter((p) => p.status === 'overdue').length,
        },
      },
      success: true,
    };
  }

  async getRiskNotificationsPreview(parentId: string) {
    const parent = await this.parentModel.findById(parentId).exec();
    if (!parent) throw new NotFoundException('PARENT.NOT_FOUND');

    const studentIds = (parent.studentIds ?? []).map((s) => s.toString());
    const attendance = await this.attendanceModel
      .find({ studentId: { $in: studentIds } })
      .sort({ createdAt: -1 })
      .limit(300)
      .exec();

    const overduePayments = await this.studentPaymentModel
      .find({ status: 'overdue' })
      .sort({ dueDate: -1 })
      .limit(100)
      .exec();

    const absent3 = studentIds.filter((sid) => {
      const recent = attendance.filter((a) => a.studentId.toString() === sid).slice(0, 3);
      return recent.length === 3 && recent.every((r) => r.status === 'absent');
    });

    return {
      message: 'PARENT.RISK_NOTIFICATIONS_PREVIEW',
      data: {
        absent3Students: absent3,
        overduePayments: overduePayments.map((p) => ({ paymentId: p._id, dueDate: p.dueDate, amount: p.amount })),
      },
      success: true,
    };
  }
}
