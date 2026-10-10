import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from './entities/group.entity';
import { Course, CourseSchema } from '../courses/entities/course.entity';
import { Lesson, LessonSchema } from '../lessons/entities/lesson.entity';
import { GroupStudent, GroupStudentSchema } from '../group-students/entities/group-student.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
