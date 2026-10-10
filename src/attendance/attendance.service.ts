import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_THRESHOLD_PERCENT,
  CONSECUTIVE_ABSENCE_WARNING,
  normalizeAttendanceStatus,
} from '../common/constants/attendance.constants';
import { calculateLateMinutes } from '../common/utils/time.utils';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Student, StudentDocument } from '../students/entities/student.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance, AttendanceDocument } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const normalized = normalizeAttendanceStatus(createAttendanceDto.status);
    let lateMinute = createAttendanceDto.lateMinute ?? 0;

    if (
      (normalized === ATTENDANCE_STATUS.PRESENT || normalized === ATTENDANCE_STATUS.LATE) &&
      !createAttendanceDto.lateMinute
    ) {
      lateMinute = await this.autoCalculateLateMinute(
        createAttendanceDto.lessonId,
        normalized,
      );
    }

    const attendance = await this.attendanceModel.create({
      ...createAttendanceDto,
      status: normalized,
      lateMinute,
    });

    await this.runPostUpdateChecks(
      createAttendanceDto.studentId,
      createAttendanceDto.groupId,
    );

    return {
      message: 'ATTENDANCE.CREATED',
      data: attendance,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.attendanceModel
      .find()
      .populate('groupId')
      .populate('studentId')
      .populate('lessonId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.attendanceModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'ATTENDANCE.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'ATTENDANCE.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const attendance = await this.attendanceModel
      .findById(id)
      .populate('groupId')
      .populate('studentId')
      .populate('lessonId')
      .exec();
    if (!attendance) {
      throw new NotFoundException('ATTENDANCE.NOT_FOUND');
    }
    return {
      message: 'ATTENDANCE.FOUND',
      data: attendance,
      success: true,
    };
  }

  async findByGroup(groupId: string, limit: number = 50, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.attendanceModel
      .find({ groupId })
      .populate('studentId')
      .populate('lessonId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.attendanceModel.countDocuments({ groupId });

    return {
      message: 'ATTENDANCE.GROUP_LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findByStudentInGroup(groupId: string, studentId: string) {
    const data = await this.attendanceModel
      .find({ groupId, studentId })
      .populate('lessonId')
      .sort({ _id: 1 })
      .exec();

    return {
      message: 'ATTENDANCE.STUDENT_LIST_FOUND',
      data,
      success: true,
    };
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto) {
    const existing = await this.attendanceModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException('ATTENDANCE.NOT_FOUND');
    }

    const payload: Record<string, unknown> = { ...updateAttendanceDto };
    if (updateAttendanceDto.status) {
      payload.status = normalizeAttendanceStatus(updateAttendanceDto.status);
    }

    if (
      payload.status &&
      (payload.status === ATTENDANCE_STATUS.PRESENT ||
        payload.status === ATTENDANCE_STATUS.LATE) &&
      updateAttendanceDto.lateMinute === undefined
    ) {
      payload.lateMinute = await this.autoCalculateLateMinute(
        existing.lessonId.toString(),
        payload.status as string,
      );
      if ((payload.lateMinute as number) > 0 && payload.status === ATTENDANCE_STATUS.PRESENT) {
        payload.status = ATTENDANCE_STATUS.LATE;
      }
    }

    const attendance = await this.attendanceModel
      .findByIdAndUpdate(id, payload, { new: true })
      .exec();

    await this.runPostUpdateChecks(
      existing.studentId.toString(),
      existing.groupId.toString(),
    );

    return {
      message: 'ATTENDANCE.UPDATED',
      data: attendance,
      success: true,
    };
  }

  async batchUpdate(records: { id: string; status: string; lateMinute?: number }[]) {
    const updatedRecords: AttendanceDocument[] = [];
    for (const record of records) {
      const result = await this.update(record.id, {
        status: record.status,
        lateMinute: record.lateMinute,
      });
      if (result.data) {
        updatedRecords.push(result.data);
      }
    }

    return {
      message: 'ATTENDANCE.BATCH_UPDATED',
      data: updatedRecords,
      success: true,
    };
  }

  /** Mark all attendance records for a lesson with the same status (shortcut for teachers). */
  async batchMarkGroup(lessonId: string, status: string) {
    const normalized = normalizeAttendanceStatus(status);
    const records = await this.attendanceModel.find({ lessonId }).exec();

    if (records.length === 0) {
      throw new NotFoundException('ATTENDANCE.LESSON_RECORDS_NOT_FOUND');
    }

    const lesson = await this.lessonModel.findById(lessonId).exec();
    const updatedRecords: AttendanceDocument[] = [];

    for (const record of records) {
      let lateMinute = 0;
      if (
        lesson?.startTime &&
        (normalized === ATTENDANCE_STATUS.PRESENT || normalized === ATTENDANCE_STATUS.LATE)
      ) {
        lateMinute = calculateLateMinutes(lesson.startTime);
      }
      const finalStatus =
        lateMinute > 0 && normalized === ATTENDANCE_STATUS.PRESENT
          ? ATTENDANCE_STATUS.LATE
          : normalized;

      const updated = await this.attendanceModel
        .findByIdAndUpdate(
          record._id,
          { status: finalStatus, lateMinute },
          { new: true },
        )
        .exec();
      if (updated) {
        updatedRecords.push(updated);
        await this.runPostUpdateChecks(
          record.studentId.toString(),
          record.groupId.toString(),
        );
      }
    }

    return {
      message: 'ATTENDANCE.BATCH_MARKED',
      data: updatedRecords,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.attendanceModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('ATTENDANCE.NOT_FOUND');
    }
    return {
      message: 'ATTENDANCE.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  private async autoCalculateLateMinute(
    lessonId: string,
    status: string,
  ): Promise<number> {
    if (
      status !== ATTENDANCE_STATUS.PRESENT &&
      status !== ATTENDANCE_STATUS.LATE
    ) {
      return 0;
    }
    const lesson = await this.lessonModel.findById(lessonId).exec();
    if (!lesson?.startTime) return 0;
    return calculateLateMinutes(lesson.startTime);
  }

  private async runPostUpdateChecks(
    studentId: string,
    groupId: string,
  ): Promise<void> {
    await this.checkConsecutiveAbsences(studentId, groupId);
    await this.checkAttendanceThreshold(studentId, groupId);
  }

  private async checkConsecutiveAbsences(
    studentId: string,
    groupId: string,
  ): Promise<void> {
    const records = await this.attendanceModel
      .find({ studentId, groupId, status: { $ne: ATTENDANCE_STATUS.PENDING } })
      .sort({ createdAt: -1 })
      .limit(CONSECUTIVE_ABSENCE_WARNING)
      .exec();

    if (records.length < CONSECUTIVE_ABSENCE_WARNING) return;

    const allAbsent = records.every((r) => r.status === ATTENDANCE_STATUS.ABSENT);
    if (!allAbsent) return;

    const student = await this.studentModel.findById(studentId).exec();
    if (!student) return;

    await this.notificationsService.createFromTemplate(
      'attendance_consecutive_absence',
      student.userId.toString(),
      { count: CONSECUTIVE_ABSENCE_WARNING },
    );
  }

  private async checkAttendanceThreshold(
    studentId: string,
    groupId: string,
  ): Promise<void> {
    const completedLessons = await this.lessonModel.countDocuments({
      groupId,
      status: 'completed',
    });
    if (completedLessons === 0) return;

    const presentCount = await this.attendanceModel.countDocuments({
      groupId,
      studentId,
      status: { $in: [ATTENDANCE_STATUS.PRESENT, ATTENDANCE_STATUS.LATE] },
    });

    const percentage = Math.round((presentCount / completedLessons) * 100);
    if (percentage >= ATTENDANCE_THRESHOLD_PERCENT) return;

    const student = await this.studentModel.findById(studentId).exec();
    if (!student) return;

    await this.notificationsService.createFromTemplate(
      'attendance_low_percentage',
      student.userId.toString(),
      { percentage, threshold: ATTENDANCE_THRESHOLD_PERCENT },
    );
  }
}
