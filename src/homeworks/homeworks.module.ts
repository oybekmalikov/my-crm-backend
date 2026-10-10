import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupStudent, GroupStudentSchema } from '../group-students/entities/group-student.entity';
import { Lesson, LessonSchema } from '../lessons/entities/lesson.entity';
import { StudentHomework, StudentHomeworkSchema } from '../student-homeworks/entities/student-homework.entity';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { Homework, HomeworkSchema } from './entities/homework.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
      { name: StudentHomework.name, schema: StudentHomeworkSchema },
    ]),
  ],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
