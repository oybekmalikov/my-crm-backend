import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ATTENDANCE_STATUS } from '../common/constants/attendance.constants';
import { STUDENT_POINTS_LEVELS, STUDENT_XP_LEVELS } from '../app.constants';
import {
  Attendance,
  AttendanceDocument,
} from '../attendance/entities/attendance.entity';
import {
  ExamResult,
  ExamResultDocument,
} from '../exam-results/entities/exam-result.entity';
import {
  GroupStudent,
  GroupStudentDocument,
} from '../group-students/entities/group-student.entity';
import {
  HomeworkResult,
  HomeworkResultDocument,
} from '../homework-results/entities/homework-result.entity';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import {
  StudentHomework,
  StudentHomeworkDocument,
} from '../student-homeworks/entities/student-homework.entity';
import {
  StudentPayment,
  StudentPaymentDocument,
} from '../student-payments/entities/student-payment.entity';
import {
  StudentsContract,
  StudentsContractDocument,
} from '../students-contracts/entities/students-contract.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student, StudentDocument } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(StudentHomework.name)
    private studentHomeworkModel: Model<StudentHomeworkDocument>,
    @InjectModel(HomeworkResult.name)
    private homeworkResultModel: Model<HomeworkResultDocument>,
    @InjectModel(ExamResult.name)
    private examResultModel: Model<ExamResultDocument>,
    @InjectModel(GroupStudent.name)
    private groupStudentModel: Model<GroupStudentDocument>,
    @InjectModel(StudentsContract.name)
    private studentsContractModel: Model<StudentsContractDocument>,
    @InjectModel(StudentPayment.name)
    private studentPaymentModel: Model<StudentPaymentDocument>,
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = await this.studentModel.create(createStudentDto);
    return {
      message: 'STUDENT.CREATED',
      data: student,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.studentModel.countDocuments();
    if (data.length === 0) {
      return {
        message: 'STUDENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STUDENT.LIST_FOUND',
      data: { students: data, total, page, limit },
      success: true,
    };
  }

  /**
   * #58 — Students Leaderboard.
   * Returns top students sorted by XP in descending order.
   */
  async getLeaderboard(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentModel
      .find({ isActive: true })
      .populate('user', 'firstName lastName')
      .sort({ xp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.studentModel.countDocuments({ isActive: true });

    return {
      message: 'STUDENT.LEADERBOARD',
      data: { leaderboard: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const student = await this.studentModel
      .findById(id)
      .populate('user')
      .exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT.FOUND',
      data: student,
      success: true,
    };
  }

  async findOneByUserId(userId: string) {
    const student = await this.studentModel
      .findOne({ userId })
      .populate('user')
      .exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT.FOUND',
      data: student,
      success: true,
    };
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const updated = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT.UPDATED',
      data: updated,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.studentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    return {
      message: 'STUDENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async updateXP_Points(
    id: string,
    added_xp: number = 0,
    added_point: number = 0,
    source: string = 'manual',
  ) {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }
    const { level, xp, point } = student;
    const xpLogs = [...(student.xpLogs ?? [])];
    if (added_xp > 0) {
      xpLogs.push({ source, amount: added_xp, type: 'xp', createdAt: new Date() });
    }
    if (added_point > 0) {
      xpLogs.push({ source, amount: added_point, type: 'point', createdAt: new Date() });
    }

    const newXp = xp + added_xp;
    const leveledUp = STUDENT_XP_LEVELS[level] <= newXp;
    const newLevel = leveledUp ? level + 1 : level;

    let newPoint: number;
    if (added_point === 0) {
      newPoint = STUDENT_POINTS_LEVELS[level] * newXp;
    } else {
      newPoint = point + added_point;
    }

    await this.studentModel
      .findByIdAndUpdate(id, {
        level: newLevel,
        xp: newXp,
        point: newPoint,
        xpLogs,
      })
      .exec();

    return {
      message: 'STUDENT.XP_POINTS_UPDATED',
      data: await this.studentModel.findById(id).exec(),
      success: true,
    };
  }

  /** Recalculate avarageMark from accepted homework and exam results. */
  async recalculateAverageMark(studentId: string): Promise<number> {
    const studentHomeworks = await this.studentHomeworkModel
      .find({ studentId })
      .select('_id')
      .exec();
    const shIds = studentHomeworks.map((sh) => sh._id.toString());

    if (shIds.length === 0) {
      await this.studentModel.findByIdAndUpdate(studentId, { avarageMark: 0 });
      return 0;
    }

    const hwResults = await this.homeworkResultModel
      .find({ studentHomeworkId: { $in: shIds }, status: 'accepted' })
      .select('mark')
      .exec();

    const examResults = await this.examResultModel
      .find({ workId: { $in: shIds }, isAccepted: true })
      .select('mark')
      .exec();

    const allMarks = [
      ...hwResults.map((r) => r.mark),
      ...examResults.map((r) => r.mark),
    ];
    const avg =
      allMarks.length > 0
        ? Math.round(allMarks.reduce((a, b) => a + b, 0) / allMarks.length)
        : 0;

    await this.studentModel.findByIdAndUpdate(studentId, { avarageMark: avg });
    return avg;
  }

  /** Full profile summary: groups, payments, attendance, marks. */
  async getProfileSummary(id: string) {
    const student = await this.studentModel.findById(id).populate('user').exec();
    if (!student) {
      throw new NotFoundException('STUDENT.NOT_FOUND');
    }

    const groups = await this.groupStudentModel
      .find({ studentId: id })
      .populate('groupId')
      .exec();

    const contracts = await this.studentsContractModel
      .find({ studentId: id, isActive: true })
      .populate('courseId')
      .exec();

    const contractIds = contracts.map((c) => c._id.toString());
    const payments = await this.studentPaymentModel
      .find({ offerId: { $in: contractIds }, isDeleted: false })
      .sort({ dueDate: 1 })
      .exec();

    const nextPayment = payments.find((p) => p.status === 'pending' || p.status === 'overdue');

    const attendanceStats: Array<{
      groupId: string;
      percentage: number;
      present: number;
      total: number;
    }> = [];

    for (const gs of groups.filter((g) => g.status === 'studying')) {
      const groupId = gs.groupId.toString();
      const completedLessons = await this.lessonModel.countDocuments({
        groupId,
        status: 'completed',
      });
      const presentCount = await this.attendanceModel.countDocuments({
        groupId,
        studentId: id,
        status: { $in: [ATTENDANCE_STATUS.PRESENT, ATTENDANCE_STATUS.LATE] },
      });
      attendanceStats.push({
        groupId,
        percentage:
          completedLessons > 0
            ? Math.round((presentCount / completedLessons) * 100)
            : 0,
        present: presentCount,
        total: completedLessons,
      });
    }

    return {
      message: 'STUDENT.PROFILE_SUMMARY',
      data: {
        student,
        groups,
        contracts,
        payments: {
          total: payments.length,
          completed: payments.filter((p) => p.status === 'completed').length,
          pending: payments.filter((p) => p.status === 'pending').length,
          overdue: payments.filter((p) => p.status === 'overdue').length,
          nextPayment: nextPayment ?? null,
        },
        attendanceStats,
      },
      success: true,
    };
  }
}
