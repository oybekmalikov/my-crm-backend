import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from '../attendance/entities/attendance.entity';
import { ExamResult, ExamResultSchema } from '../exam-results/entities/exam-result.entity';
import { GroupStudent, GroupStudentSchema } from '../group-students/entities/group-student.entity';
import { HomeworkResult, HomeworkResultSchema } from '../homework-results/entities/homework-result.entity';
import { Lesson, LessonSchema } from '../lessons/entities/lesson.entity';
import { StudentHomework, StudentHomeworkSchema } from '../student-homeworks/entities/student-homework.entity';
import { StudentPayment, StudentPaymentSchema } from '../student-payments/entities/student-payment.entity';
import { StudentsContract, StudentsContractSchema } from '../students-contracts/entities/students-contract.entity';
import { Student, StudentSchema } from './entities/student.entity';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: StudentHomework.name, schema: StudentHomeworkSchema },
      { name: HomeworkResult.name, schema: HomeworkResultSchema },
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
      { name: StudentsContract.name, schema: StudentsContractSchema },
      { name: StudentPayment.name, schema: StudentPaymentSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
