import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from '../students/entities/student.entity';
import { Staff, StaffDocument } from '../staffs/entities/staff.entity';
import { Group, GroupDocument } from '../groups/entities/group.entity';
import {
  BudgetTransaction,
  BudgetTransactionDocument,
} from '../budget-transactions/entities/budget-transaction.entity';
import {
  StudentsContract,
  StudentsContractDocument,
} from '../students-contracts/entities/students-contract.entity';
import {
  StudentPayment,
  StudentPaymentDocument,
} from '../student-payments/entities/student-payment.entity';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import {
  Attendance,
  AttendanceDocument,
} from '../attendance/entities/attendance.entity';
import {
  GroupStudent,
  GroupStudentDocument,
} from '../group-students/entities/group-student.entity';
import { Lead, LeadDocument } from '../leads/entities/lead.entity';
import { Course, CourseDocument } from '../courses/entities/course.entity';
import { AttendanceQueryDto } from './dto/attendance-query.dto';
import { LeadsQueryDto } from './dto/leads-query.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<StudentDocument>,

    @InjectModel(Staff.name)
    private staffModel: Model<StaffDocument>,

    @InjectModel(Group.name)
    private groupModel: Model<GroupDocument>,

    @InjectModel(BudgetTransaction.name)
    private budgetTransactionModel: Model<BudgetTransactionDocument>,

    @InjectModel(StudentsContract.name)
    private studentsContractModel: Model<StudentsContractDocument>,

    @InjectModel(StudentPayment.name)
    private studentPaymentModel: Model<StudentPaymentDocument>,

    @InjectModel(Lesson.name)
    private lessonModel: Model<LessonDocument>,

    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,

    @InjectModel(GroupStudent.name)
    private groupStudentModel: Model<GroupStudentDocument>,

    @InjectModel(Lead.name)
    private leadModel: Model<LeadDocument>,

    @InjectModel(Course.name)
    private courseModel: Model<CourseDocument>,
  ) {}

  // ─── Overview ──────────────────────────────────────────────────────────────

  async getOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const next7Days = new Date(now);
    next7Days.setDate(now.getDate() + 7);

    // Format dates as YYYY-MM-DD strings for string-based date fields
    const todayStr = now.toISOString().slice(0, 10);
    const next7DaysStr = next7Days.toISOString().slice(0, 10);
    const startOfMonthStr = startOfMonth.toISOString().slice(0, 10);
    const endOfMonthStr = endOfMonth.toISOString().slice(0, 10);

    const [
      totalActiveStudents,
      totalStaff,
      totalActiveGroups,
      monthlyTransactions,
      overdueContracts,
      upcomingLessons,
    ] = await Promise.all([
      this.studentModel.countDocuments({ isActive: true }),
      this.staffModel.countDocuments({ isActive: true }),
      this.groupModel.countDocuments({ status: 'active' }),
      this.budgetTransactionModel.aggregate([
        {
          $match: {
            status: 'completed',
            isDeleted: false,
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: '$target',
            total: { $sum: '$totalSum' },
          },
        },
      ]),
      // Overdue: student-payments that are pending and paymentDate has passed
      this.studentPaymentModel.countDocuments({
        status: 'pending',
        isDeleted: false,
        paymentDate: { $lt: now },
      }),
      // Upcoming lessons in the next 7 days (scheduled status)
      this.lessonModel.countDocuments({
        status: 'scheduled',
        date: { $gte: todayStr, $lte: next7DaysStr },
      }),
    ]);

    const revenue =
      monthlyTransactions.find((t: any) => t._id === 'income')?.total ?? 0;
    const expense =
      monthlyTransactions.find((t: any) => t._id === 'expense')?.total ?? 0;

    return {
      message: 'DASHBOARD.OVERVIEW',
      data: {
        totalActiveStudents,
        totalStaff,
        totalActiveGroups,
        thisMonth: {
          revenue,
          expense,
          netBalance: revenue - expense,
        },
        overdueStudentPayments: overdueContracts,
        upcomingLessonsNext7Days: upcomingLessons,
      },
      success: true,
    };
  }

  // ─── Attendance Rate ────────────────────────────────────────────────────────

  async getAttendanceRate(query: AttendanceQueryDto) {
    const filter: Record<string, any> = {};

    if (query.groupId) {
      filter.groupId = new Types.ObjectId(query.groupId);
    }

    // Attendance records don't have a date field directly; we use the lesson's
    // date. We filter attendance by lessonId where lesson.date is in range.
    let lessonIds: Types.ObjectId[] | undefined;
    if (query.fromDate || query.toDate) {
      const lessonFilter: Record<string, any> = {};
      if (query.fromDate) lessonFilter.$gte = query.fromDate;
      if (query.toDate) lessonFilter.$lte = query.toDate;

      const lessons = await this.lessonModel
        .find({ date: lessonFilter }, { _id: 1 })
        .lean()
        .exec();
      lessonIds = lessons.map((l) => l._id as Types.ObjectId);

      if (lessonIds.length === 0) {
        return {
          message: 'DASHBOARD.ATTENDANCE_RATE',
          data: {
            totalRecords: 0,
            presentCount: 0,
            attendanceRate: 0,
            groupId: query.groupId ?? null,
            fromDate: query.fromDate ?? null,
            toDate: query.toDate ?? null,
          },
          success: true,
        };
      }
      filter.lessonId = { $in: lessonIds };
    }

    const [totalRecords, presentCount] = await Promise.all([
      this.attendanceModel.countDocuments(filter),
      this.attendanceModel.countDocuments({ ...filter, status: 'present' }),
    ]);

    const attendanceRate =
      totalRecords > 0
        ? Math.round((presentCount / totalRecords) * 10000) / 100
        : 0;

    return {
      message: 'DASHBOARD.ATTENDANCE_RATE',
      data: {
        totalRecords,
        presentCount,
        attendanceRate,
        groupId: query.groupId ?? null,
        fromDate: query.fromDate ?? null,
        toDate: query.toDate ?? null,
      },
      success: true,
    };
  }

  // ─── Enrollment ─────────────────────────────────────────────────────────────

  async getEnrollment() {
    // Top groups by active student count (studying status)
    const topGroups = await this.groupStudentModel.aggregate([
      { $match: { status: 'studying' } },
      { $group: { _id: '$groupId', activeStudents: { $sum: 1 } } },
      { $sort: { activeStudents: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'group',
        },
      },
      { $unwind: { path: '$group', preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: 'courses',
          localField: 'group.courseId',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          groupId: '$_id',
          groupName: '$group.name',
          courseId: '$group.courseId',
          courseName: '$course.name',
          activeStudents: 1,
        },
      },
    ]);

    // Top courses by total active students across all their groups
    const topCourses = await this.groupStudentModel.aggregate([
      { $match: { status: 'studying' } },
      {
        $lookup: {
          from: 'groups',
          localField: 'groupId',
          foreignField: '_id',
          as: 'group',
        },
      },
      { $unwind: { path: '$group', preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: '$group.courseId',
          activeStudents: { $sum: 1 },
          groupCount: { $addToSet: '$groupId' },
        },
      },
      {
        $project: {
          _id: 0,
          courseId: '$_id',
          activeStudents: 1,
          groupCount: { $size: '$groupCount' },
        },
      },
      { $sort: { activeStudents: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: {
          path: '$course',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          courseId: 1,
          courseName: '$course.name',
          activeStudents: 1,
          groupCount: 1,
        },
      },
    ]);

    return {
      message: 'DASHBOARD.ENROLLMENT',
      data: {
        topGroups,
        topCourses,
      },
      success: true,
    };
  }

  // ─── Leads ──────────────────────────────────────────────────────────────────

  async getLeads(query: LeadsQueryDto) {
    const filter: Record<string, any> = {};

    if (query.fromDate || query.toDate) {
      filter.createdAt = {};
      if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
      if (query.toDate) filter.createdAt.$lte = new Date(query.toDate);
    }

    const statusBreakdown = await this.leadModel.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
      { $sort: { status: 1 } },
    ]);

    const total = statusBreakdown.reduce(
      (sum: number, s: any) => sum + s.count,
      0,
    );

    // "registered" is the terminal converted status in this codebase
    const converted =
      statusBreakdown.find((s: any) => s.status === 'registered')?.count ?? 0;
    const conversionRate =
      total > 0 ? Math.round((converted / total) * 10000) / 100 : 0;

    return {
      message: 'DASHBOARD.LEADS',
      data: {
        total,
        converted,
        conversionRate,
        statusBreakdown,
        fromDate: query.fromDate ?? null,
        toDate: query.toDate ?? null,
      },
      success: true,
    };
  }
}
