import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentPaymentsService } from './student-payments.service';
import { StudentPaymentsController } from './student-payments.controller';
import { StudentPayment, StudentPaymentSchema } from './entities/student-payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentPayment.name, schema: StudentPaymentSchema }]),
  ],
  controllers: [StudentPaymentsController],
  providers: [StudentPaymentsService],
})
export class StudentPaymentsModule {}
