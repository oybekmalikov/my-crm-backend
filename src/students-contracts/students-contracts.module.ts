import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursePlan, CoursePlanSchema } from '../course-plans/entities/course-plan.entity';
import { StudentPayment, StudentPaymentSchema } from '../student-payments/entities/student-payment.entity';
import { StudentsContract, StudentsContractSchema } from './entities/students-contract.entity';
import { StudentsContractsController } from './students-contracts.controller';
import { StudentsContractsService } from './students-contracts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentsContract.name, schema: StudentsContractSchema },
      { name: StudentPayment.name, schema: StudentPaymentSchema },
      { name: CoursePlan.name, schema: CoursePlanSchema },
    ]),
  ],
  controllers: [StudentsContractsController],
  providers: [StudentsContractsService],
  exports: [StudentsContractsService],
})
export class StudentsContractsModule {}
