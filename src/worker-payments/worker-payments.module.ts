import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerPaymentsService } from './worker-payments.service';
import { WorkerPaymentsController } from './worker-payments.controller';
import { WorkerPayment, WorkerPaymentSchema } from './entities/worker-payment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkerPayment.name, schema: WorkerPaymentSchema }]),
  ],
  controllers: [WorkerPaymentsController],
  providers: [WorkerPaymentsService],
})
export class WorkerPaymentsModule {}
