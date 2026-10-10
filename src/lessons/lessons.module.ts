import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson, LessonSchema } from './entities/lesson.entity';
import { GroupStudent, GroupStudentSchema } from '../group-students/entities/group-student.entity';
import { Attendance, AttendanceSchema } from '../attendance/entities/attendance.entity';
import { Group, GroupSchema } from '../groups/entities/group.entity';
import { Room, RoomSchema } from '../rooms/entities/room.entity';
import { CourseCompletedStudent, CourseCompletedStudentSchema } from '../course-completed-students/entities/course-completed-student.entity';
import { StudentWorking, StudentWorkingSchema } from '../students-working/entities/student-working.entity';
import { Homework, HomeworkSchema } from '../homeworks/entities/homework.entity';
import { StudentHomework, StudentHomeworkSchema } from '../student-homeworks/entities/student-homework.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Room.name, schema: RoomSchema },
      { name: CourseCompletedStudent.name, schema: CourseCompletedStudentSchema },
      { name: StudentWorking.name, schema: StudentWorkingSchema },
      { name: Homework.name, schema: HomeworkSchema },
      { name: StudentHomework.name, schema: StudentHomeworkSchema },
    ]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
