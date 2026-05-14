import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseCompletedStudentsService } from './course-completed-students.service';
import { CourseCompletedStudentsController } from './course-completed-students.controller';
import { CourseCompletedStudent, CourseCompletedStudentSchema } from './entities/course-completed-student.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CourseCompletedStudent.name, schema: CourseCompletedStudentSchema }]),
  ],
  controllers: [CourseCompletedStudentsController],
  providers: [CourseCompletedStudentsService],
})
export class CourseCompletedStudentsModule {}
