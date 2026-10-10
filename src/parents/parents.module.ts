import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from '../attendance/entities/attendance.entity';
import { HomeworkResult, HomeworkResultSchema } from '../homework-results/entities/homework-result.entity';
import { StudentPayment, StudentPaymentSchema } from '../student-payments/entities/student-payment.entity';
import { StudentHomework, StudentHomeworkSchema } from '../student-homeworks/entities/student-homework.entity';
import { UsersModule } from '../users/users.module';
import { Parent, ParentSchema } from './entities/parent.entity';
import { ParentsController } from './parents.controller';
import { ParentsService } from './parents.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parent.name, schema: ParentSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: StudentHomework.name, schema: StudentHomeworkSchema },
      { name: HomeworkResult.name, schema: HomeworkResultSchema },
      { name: StudentPayment.name, schema: StudentPaymentSchema },
    ]),
    UsersModule,
  ],
  controllers: [ParentsController],
  providers: [ParentsService],
  exports: [ParentsService],
})
export class ParentsModule {}
