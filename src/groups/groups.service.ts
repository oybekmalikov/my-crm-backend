import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/entities/course.entity';
import { Lesson, LessonDocument } from '../lessons/entities/lesson.entity';
import { GroupStudent, GroupStudentDocument } from '../group-students/entities/group-student.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, GroupDocument } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(GroupStudent.name) private groupStudentModel: Model<GroupStudentDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    const course = await this.courseModel.findById(createGroupDto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const now = new Date();
    const currentDay = now.getDay();
    let daysToNextMonday = (1 - currentDay + 7) % 7;
    if (daysToNextMonday === 0) daysToNextMonday = 7;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() + daysToNextMonday);

    if (course.lessonDays === 'even_days') {
      startDate.setDate(startDate.getDate() + 1);
    }

    const validDays =
      course.lessonDays === 'odd_days'
        ? [1, 3, 5]
        : course.lessonDays === 'even_days'
          ? [2, 4, 6]
          : [1, 2, 3, 4, 5];

    const totalLessons = course.duration * course.monthLessons;
    const lessonDates: string[] = [];

    const currentDate = new Date(startDate);
    while (lessonDates.length < totalLessons) {
      if (validDays.includes(currentDate.getDay())) {
        lessonDates.push(currentDate.toISOString().split('T')[0]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const endDate = lessonDates[lessonDates.length - 1];

    const groupData = {
      ...createGroupDto,
      startDate:
        createGroupDto.startDate || startDate.toISOString().split('T')[0],
      endDate: createGroupDto.endDate || endDate,
    };

    const group = await this.groupModel.create(groupData);

    const lessonsToCreate = lessonDates.map((date, index) => ({
      title: `${index + 1}-dars`,
      description: `${group.name} guruhi uchun ${index + 1}-dars`,
      groupId: group._id,
      status: 'scheduled',
      date: date,
      type: 'lesson',
    }));

    await this.lessonModel.insertMany(lessonsToCreate);

    return {
      message: 'GROUP.CREATED',
      data: group,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    await this.syncGroupStatuses();

    const skip = (page - 1) * limit;
    const data = await this.groupModel
      .find()
      .populate('courseId')
      .populate('branchId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.groupModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'GROUP.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'GROUP.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const group = await this.groupModel
      .findById(id)
      .populate('courseId')
      .populate('branchId')
      .exec();
    if (!group) {
      throw new NotFoundException('GROUP.NOT_FOUND');
    }
    return {
      message: 'GROUP.FOUND',
      data: group,
      success: true,
    };
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupModel
      .findByIdAndUpdate(id, updateGroupDto, { new: true })
      .exec();
    if (!group) {
      throw new NotFoundException('GROUP.NOT_FOUND');
    }
    return {
      message: 'GROUP.UPDATED',
      data: group,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.groupModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('GROUP.NOT_FOUND');
    }
    return {
      message: 'GROUP.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  /**
   * Auto-transition group statuses:
   * new → active when startDate reached,
   * active → completed when endDate passed and all lessons done.
   */
  async syncGroupStatuses(): Promise<{ updated: number }> {
    const today = new Date().toISOString().split('T')[0];
    let updated = 0;

    const newToActive = await this.groupModel.updateMany(
      { status: 'new', startDate: { $lte: today } },
      { status: 'active' },
    );
    updated += newToActive.modifiedCount;

    const activeGroups = await this.groupModel
      .find({ status: 'active', endDate: { $lt: today } })
      .exec();

    for (const group of activeGroups) {
      const incomplete = await this.lessonModel.countDocuments({
        groupId: group._id.toString(),
        status: { $nin: ['completed', 'cancelled'] },
      });
      if (incomplete === 0) {
        await this.groupModel.findByIdAndUpdate(group._id, { status: 'completed' });
        updated++;
      }
    }

    return { updated };
  }

  /**
   * #38 — Group Ranking.
   * Calculates the average mark of students in the group and returns them sorted (leaderboard).
   */
  async getGroupRanking(groupId: string) {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) throw new NotFoundException('GROUP.NOT_FOUND');

    // Find all students currently studying in the group
    const groupStudents = await this.groupStudentModel
      .find({ groupId, status: { $in: ['studying', 'waitlisted'] } })
      .populate({
        path: 'studentId',
        populate: { path: 'user', select: 'firstName lastName' },
      })
      .exec();

    // Map and sort by student's average mark descending
    const ranking = groupStudents
      .map((gs: any) => ({
        studentId: gs.studentId._id,
        firstName: gs.studentId.user?.firstName,
        lastName: gs.studentId.user?.lastName,
        averageMark: gs.studentId.avarageMark || 0,
        xp: gs.studentId.xp || 0,
      }))
      .sort((a, b) => b.averageMark - a.averageMark);

    return {
      message: 'GROUP.RANKING_FOUND',
      data: {
        groupId,
        groupName: group.name,
        ranking,
      },
      success: true,
    };
  }
}
