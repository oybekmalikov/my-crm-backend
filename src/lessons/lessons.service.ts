import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson, LessonDocument } from './entities/lesson.entity';
import { GroupStudent, GroupStudentDocument } from '../group-students/entities/group-student.entity';
import { Attendance, AttendanceDocument } from '../attendance/entities/attendance.entity';
import { Group, GroupDocument } from '../groups/entities/group.entity';
import { Room, RoomDocument } from '../rooms/entities/room.entity';
import { CourseCompletedStudent, CourseCompletedStudentDocument } from '../course-completed-students/entities/course-completed-student.entity';
import { StudentWorking, StudentWorkingDocument } from '../students-working/entities/student-working.entity';
import { Homework, HomeworkDocument } from '../homeworks/entities/homework.entity';
import { StudentHomework, StudentHomeworkDocument } from '../student-homeworks/entities/student-homework.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(GroupStudent.name) private groupStudentModel: Model<GroupStudentDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(CourseCompletedStudent.name) private courseCompletedStudentModel: Model<CourseCompletedStudentDocument>,
    @InjectModel(StudentWorking.name) private studentWorkingModel: Model<StudentWorkingDocument>,
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(StudentHomework.name) private studentHomeworkModel: Model<StudentHomeworkDocument>,
  ) {}

  /** Parse 'HH:mm' to total minutes from midnight */
  private timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }

  /** Check that a room is not double-booked for a given date + time window.
   *  excludeLessonId: when updating an existing lesson, exclude it from the check.
   */
  private async checkRoomAvailability(
    roomId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeLessonId?: string,
  ): Promise<void> {
    if (!startTime || !endTime) return;

    const newStart = this.timeToMinutes(startTime);
    const newEnd = this.timeToMinutes(endTime);

    const filter: any = {
      roomId,
      date,
      status: { $nin: ['cancelled'] },
      startTime: { $ne: null },
      endTime: { $ne: null },
    };
    if (excludeLessonId) {
      filter._id = { $ne: excludeLessonId };
    }

    const existingLessons = await this.lessonModel.find(filter).exec();

    for (const lesson of existingLessons) {
      if (!lesson.startTime || !lesson.endTime) continue;
      const existStart = this.timeToMinutes(lesson.startTime);
      const existEnd = this.timeToMinutes(lesson.endTime);
      // Overlap when intervals intersect (not merely touch)
      if (newStart < existEnd && newEnd > existStart) {
        throw new BadRequestException('LESSON.ROOM_ALREADY_BOOKED');
      }
    }
  }

  async create(createLessonDto: CreateLessonDto) {
    const { roomId, date, startTime, endTime } = createLessonDto;

    if (roomId) {
      const room = await this.roomModel.findById(roomId).exec();
      if (!room) throw new NotFoundException('LESSON.ROOM_NOT_FOUND');
    }

    if (roomId && date && startTime && endTime) {
      await this.checkRoomAvailability(roomId, date, startTime, endTime);
    }

    const lesson = await this.lessonModel.create(createLessonDto);
    return {
      message: 'LESSON.CREATED',
      data: lesson,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.lessonModel
      .find()
      .populate('groupId')
      .populate('roomId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.lessonModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'LESSON.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'LESSON.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const lesson = await this.lessonModel.findById(id).populate('groupId').populate('roomId').exec();
    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.FOUND',
      data: lesson,
      success: true,
    };
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const oldLesson = await this.lessonModel.findById(id).exec();
    if (!oldLesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }

    // Double-booking check on update when room/date/time is changed
    const roomId = updateLessonDto.roomId ?? (oldLesson.roomId ? String(oldLesson.roomId) : undefined);
    const date = updateLessonDto.date ?? oldLesson.date;
    const startTime = updateLessonDto.startTime ?? oldLesson.startTime ?? undefined;
    const endTime = updateLessonDto.endTime ?? oldLesson.endTime ?? undefined;

    if (roomId && date && startTime && endTime) {
      await this.checkRoomAvailability(roomId, date, startTime, endTime, id);
    }

    const lesson = await this.lessonModel
      .findByIdAndUpdate(id, updateLessonDto, { new: true })
      .exec();

    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }

    if (updateLessonDto.status === 'progress' && oldLesson.status !== 'progress') {
      const activeStudents = await this.groupStudentModel.find({
        groupId: lesson.groupId,
        status: 'studying',
      }).exec();

      if (activeStudents.length > 0) {
        const attendanceRecords = activeStudents.map(student => ({
          groupId: lesson.groupId,
          studentId: student.studentId,
          lessonId: lesson._id,
          status: 'pending',
          lateMinute: 0,
        }));
        await this.attendanceModel.insertMany(attendanceRecords);
      }
    }

    // When a lesson transitions to 'completed', close it (mark absent any pending/missing)
    if (updateLessonDto.status === 'completed' && oldLesson.status !== 'completed') {
      await this.closeLesson(String(lesson._id));
      await this.triggerCourseCompletion(String(lesson.groupId));
    }

    return {
      message: 'LESSON.UPDATED',
      data: lesson,
      success: true,
    };
  }

  /**
   * Close a lesson: any group student (studying) without an explicit present/absent
   * attendance record for this lesson gets marked as absent.
   */
  async closeLesson(lessonId: string) {
    const lesson = await this.lessonModel.findById(lessonId).exec();
    if (!lesson) throw new NotFoundException('LESSON.NOT_FOUND');

    const activeStudents = await this.groupStudentModel.find({
      groupId: lesson.groupId,
      status: 'studying',
    }).exec();

    const now = new Date();
    for (const gs of activeStudents) {
      const existing = await this.attendanceModel.findOne({
        lessonId: lesson._id.toString(),
        studentId: gs.studentId.toString(),
      }).exec();

      if (!existing) {
        await this.attendanceModel.create({
          groupId: lesson.groupId.toString(),
          studentId: gs.studentId.toString(),
          lessonId: lesson._id.toString(),
          status: 'absent',
          lateMinute: 0,
        });
      } else if (existing.status === 'pending') {
        // Pending means teacher never marked it – treat as absent
        existing.status = 'absent';
        await existing.save();
      }
    }

    // NEW: Create default student homeworks if a homework exists for this lesson (Feature 18)
    const homework = await this.homeworkModel.findOne({ lessonId }).exec();
    if (homework) {
      for (const gs of activeStudents) {
        const existingSH = await this.studentHomeworkModel.findOne({
          homeworkId: homework._id.toString(),
          studentId: gs.studentId.toString(),
        }).exec();

        if (!existingSH) {
          await this.studentHomeworkModel.create({
            homeworkId: homework._id.toString(),
            studentId: gs.studentId.toString(),
            status: 'pending',
          });
        }
      }
    }

    return {
      message: 'LESSON.CLOSED',
      data: { lessonId },
      success: true,
    };
  }

  /**
   * Compute a student's attendance percentage (present / total completed lessons) in a group.
   */
  async getAttendancePercentage(groupId: string, studentId: string) {
    const completedLessons = await this.lessonModel.countDocuments({
      groupId,
      status: 'completed',
    });

    if (completedLessons === 0) {
      return {
        message: 'LESSON.ATTENDANCE_PERCENTAGE',
        data: { groupId, studentId, percentage: 0, present: 0, total: 0 },
        success: true,
      };
    }

    const presentCount = await this.attendanceModel.countDocuments({
      groupId,
      studentId,
      status: 'present',
    });

    const percentage = Math.round((presentCount / completedLessons) * 100);

    return {
      message: 'LESSON.ATTENDANCE_PERCENTAGE',
      data: { groupId, studentId, percentage, present: presentCount, total: completedLessons },
      success: true,
    };
  }

  /**
   * Automated course-completion trigger: checks if all lessons in the group are completed,
   * and if so, creates CourseCompletedStudent + stub StudentsWorking records for active students.
   */
  private async triggerCourseCompletion(groupId: string): Promise<void> {
    const group = await this.groupModel.findById(groupId).exec();
    if (!group) return;

    // Check if any lessons are still not completed/cancelled
    const incompleteCount = await this.lessonModel.countDocuments({
      groupId,
      status: { $nin: ['completed', 'cancelled'] },
    });

    if (incompleteCount > 0) return; // still lessons remaining

    const totalLessons = await this.lessonModel.countDocuments({ groupId });
    if (totalLessons === 0) return;

    // Get all currently studying students
    const studyingStudents = await this.groupStudentModel.find({
      groupId,
      status: 'studying',
    }).exec();

    for (const gs of studyingStudents) {
      // Avoid duplicate records
      const alreadyCompleted = await this.courseCompletedStudentModel.findOne({
        studentId: gs.studentId,
        completedGroupId: groupId,
      }).exec();

      if (alreadyCompleted) continue;

      const completionRecord = await this.courseCompletedStudentModel.create({
        studentId: gs.studentId,
        completedGroupId: groupId,
        completedTime: new Date(),
      });

      // Stub StudentsWorking record (no company yet – minimal required fields filled with defaults)
      await this.studentWorkingModel.create({
        completedId: completionRecord._id.toString(),
        companyName: 'N/A',
        startDate: new Date(),
        isWorking: false,
        position: 'N/A',
        salary: 0,
      });

      // Mark group student as completed
      await this.groupStudentModel.findByIdAndUpdate(gs._id, { status: 'completed' }).exec();
    }
  }

  async remove(id: string) {
    const deleted = await this.lessonModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async cancelLesson(id: string, reason: string, cancelledBy: string) {
    const lesson = await this.lessonModel
      .findByIdAndUpdate(
        id,
        { status: 'cancelled', cancellationReason: reason, cancelledBy },
        { new: true },
      )
      .exec();
    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.CANCELLED',
      data: lesson,
      success: true,
    };
  }

  async rescheduleLesson(
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    rescheduledBy: string,
  ) {
    const lesson = await this.lessonModel.findById(id).exec();
    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }

    const roomId = lesson.roomId ? String(lesson.roomId) : undefined;
    if (roomId && newStartTime && newEndTime) {
      await this.checkRoomAvailability(roomId, newDate, newStartTime, newEndTime, id);
    }

    const historyEntry = {
      previousDate: lesson.date,
      previousStartTime: lesson.startTime,
      previousEndTime: lesson.endTime,
      rescheduledAt: new Date(),
      rescheduledBy,
    };

    const updated = await this.lessonModel
      .findByIdAndUpdate(
        id,
        {
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
          $push: { rescheduleHistory: historyEntry },
        },
        { new: true },
      )
      .exec();

    return {
      message: 'LESSON.RESCHEDULED',
      data: updated,
      success: true,
    };
  }

  async assignSubstituteTeacher(id: string, substituteTeacherId: string) {
    const lesson = await this.lessonModel
      .findByIdAndUpdate(id, { substituteTeacherId }, { new: true })
      .exec();
    if (!lesson) {
      throw new NotFoundException('LESSON.NOT_FOUND');
    }
    return {
      message: 'LESSON.SUBSTITUTE_ASSIGNED',
      data: lesson,
      success: true,
    };
  }
}
