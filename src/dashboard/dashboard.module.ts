import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';

import { Student, StudentSchema } from '../students/entities/student.entity';
import { Staff, StaffSchema } from '../staffs/entities/staff.entity';
import { Group, GroupSchema } from '../groups/entities/group.entity';
import {
  BudgetTransaction,
  BudgetTransactionSchema,
} from '../budget-transactions/entities/budget-transaction.entity';
import {
  StudentsContract,
  StudentsContractSchema,
} from '../students-contracts/entities/students-contract.entity';
import {
  StudentPayment,
  StudentPaymentSchema,
} from '../student-payments/entities/student-payment.entity';
import { Lesson, LessonSchema } from '../lessons/entities/lesson.entity';
import {
  Attendance,
  AttendanceSchema,
} from '../attendance/entities/attendance.entity';
import {
  GroupStudent,
  GroupStudentSchema,
} from '../group-students/entities/group-student.entity';
import { Lead, LeadSchema } from '../leads/entities/lead.entity';
import { Course, CourseSchema } from '../courses/entities/course.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Group.name, schema: GroupSchema },
      { name: BudgetTransaction.name, schema: BudgetTransactionSchema },
      { name: StudentsContract.name, schema: StudentsContractSchema },
      { name: StudentPayment.name, schema: StudentPaymentSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
      { name: Lead.name, schema: LeadSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardGateway],
  exports: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
