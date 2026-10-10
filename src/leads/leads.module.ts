import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from '../attendance/entities/attendance.entity';
import { GroupStudent, GroupStudentSchema } from '../group-students/entities/group-student.entity';
import { Lesson, LessonSchema } from '../lessons/entities/lesson.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { Staff, StaffSchema } from '../staffs/entities/staff.entity';
import { StudentPayment, StudentPaymentSchema } from '../student-payments/entities/student-payment.entity';
import { StudentsContract, StudentsContractSchema } from '../students-contracts/entities/students-contract.entity';
import { StudentsContractsModule } from '../students-contracts/students-contracts.module';
import { StudentsModule } from '../students/students.module';
import { UsersModule } from '../users/users.module';
import { LeadActivity, LeadActivitySchema } from './entities/lead-activity.entity';
import { Lead, LeadSchema } from './entities/lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: GroupStudent.name, schema: GroupStudentSchema },
      { name: StudentsContract.name, schema: StudentsContractSchema },
      { name: StudentPayment.name, schema: StudentPaymentSchema },
      { name: LeadActivity.name, schema: LeadActivitySchema },
    ]),
    UsersModule,
    StudentsModule,
    StudentsContractsModule,
    NotificationsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
