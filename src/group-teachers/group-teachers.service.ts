import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import { CreateGroupTeacherDto } from './dto/create-group-teacher.dto';
import { UpdateGroupTeacherDto } from './dto/update-group-teacher.dto';
import { GroupTeacher, GroupTeacherDocument } from './entities/group-teacher.entity';
import { Group, GroupDocument } from '../groups/entities/group.entity';
import { Staff, StaffDocument } from '../staffs/entities/staff.entity';

@Injectable()
export class GroupTeachersService {
  constructor(
    @InjectModel(GroupTeacher.name) private groupTeacherModel: Model<GroupTeacherDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
  ) {}

  async create(createGroupTeacherDto: CreateGroupTeacherDto) {
    const group = await this.groupModel.findById(createGroupTeacherDto.groupId);
    if (!group) throw new NotFoundException('Group not found');
    
    const staff = await this.staffModel.findById(createGroupTeacherDto.teacherId);
    if (!staff) throw new NotFoundException('Teacher (Staff) not found');

    const groupTeacher = await this.groupTeacherModel.create(createGroupTeacherDto);
    return {
      message: 'GROUP_TEACHER.CREATED',
      data: groupTeacher,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.groupTeacherModel
      .find()
      .populate('groupId')
      .populate('teacherId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.groupTeacherModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'GROUP_TEACHER.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'GROUP_TEACHER.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const groupTeacher = await this.groupTeacherModel.findById(id).populate('groupId').populate('teacherId').exec();
    if (!groupTeacher) {
      throw new NotFoundException('GROUP_TEACHER.NOT_FOUND');
    }
    return {
      message: 'GROUP_TEACHER.FOUND',
      data: groupTeacher,
      success: true,
    };
  }

  async update(id: string, updateGroupTeacherDto: UpdateGroupTeacherDto) {
    const groupTeacher = await this.groupTeacherModel
      .findByIdAndUpdate(id, updateGroupTeacherDto, { new: true })
      .exec();
    if (!groupTeacher) {
      throw new NotFoundException('GROUP_TEACHER.NOT_FOUND');
    }
    return {
      message: 'GROUP_TEACHER.UPDATED',
      data: groupTeacher,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.groupTeacherModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('GROUP_TEACHER.NOT_FOUND');
    }
    return {
      message: 'GROUP_TEACHER.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  /**
   * #55 — Teacher weekly schedule.
   * Returns all lessons for a teacher's groups in a given ISO week (Mon–Sun).
   * If weekStart is omitted, defaults to the current week's Monday.
   */
  async getWeeklySchedule(teacherId: string, weekStart?: string) {
    // Validate teacher exists
    const staff = await this.staffModel.findById(teacherId).exec();
    if (!staff) throw new NotFoundException('GROUP_TEACHER.TEACHER_NOT_FOUND');

    // Find all active groups for this teacher
    const assignments = await this.groupTeacherModel
      .find({ teacherId, status: true })
      .exec();
    const groupIds = assignments.map((a) => a.groupId.toString());

    // Compute week boundaries
    const monday = weekStart ? new Date(weekStart) : this.getCurrentMonday();
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const monStr = monday.toISOString().split('T')[0];
    const sunStr = sunday.toISOString().split('T')[0];

    // Find lessons for those groups in the date range
    const lessons = await this.lessonModel
      .find({
        groupId: { $in: groupIds },
        date: { $gte: monStr, $lte: sunStr },
      })
      .populate('groupId')
      .populate('roomId')
      .sort({ date: 1, startTime: 1 })
      .exec();

    return {
      message: 'GROUP_TEACHER.WEEKLY_SCHEDULE',
      data: {
        teacherId,
        weekStart: monStr,
        weekEnd: sunStr,
        lessons,
      },
      success: true,
    };
  }

  /**
   * #51 — Teacher workload summary.
   * Returns group count, total lessons taught this month, and total hours.
   */
  async getTeacherWorkload(teacherId: string) {
    const staff = await this.staffModel.findById(teacherId).exec();
    if (!staff) throw new NotFoundException('GROUP_TEACHER.TEACHER_NOT_FOUND');

    const assignments = await this.groupTeacherModel
      .find({ teacherId, status: true })
      .populate('groupId')
      .exec();
    const groupIds = assignments.map((a) => a.groupId.toString());

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];

    const lessons = await this.lessonModel
      .find({
        groupId: { $in: groupIds },
        date: { $gte: monthStart, $lte: monthEnd },
        status: 'completed',
      })
      .exec();

    // Calculate total hours (startTime → endTime)
    let totalMinutes = 0;
    for (const lesson of lessons) {
      if (lesson.startTime && lesson.endTime) {
        const [sh, sm] = lesson.startTime.split(':').map(Number);
        const [eh, em] = lesson.endTime.split(':').map(Number);
        totalMinutes += (eh * 60 + em) - (sh * 60 + sm);
      }
    }

    return {
      message: 'GROUP_TEACHER.WORKLOAD',
      data: {
        teacherId,
        groupCount: groupIds.length,
        completedLessonsThisMonth: lessons.length,
        totalHoursThisMonth: Math.round((totalMinutes / 60) * 10) / 10,
        groups: assignments.map((a) => a.groupId),
      },
      success: true,
    };
  }

  private getCurrentMonday(): Date {
    const today = new Date();
    const day = today.getDay(); // 0=Sun, 1=Mon ...
    const diff = (day === 0 ? -6 : 1 - day);
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
}
