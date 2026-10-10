import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerPaymentsService } from './worker-payments.service';
import { WorkerPaymentsController } from './worker-payments.controller';
import { WorkerPayment, WorkerPaymentSchema } from './entities/worker-payment.entity';
import { WorkerContract, WorkerContractSchema } from '../worker-contracts/entities/worker-contract.entity';
import { Staff, StaffSchema } from '../staffs/entities/staff.entity';
import { BudgetTransaction, BudgetTransactionSchema } from '../budget-transactions/entities/budget-transaction.entity';
import { Budget, BudgetSchema } from '../budgets/entities/budget.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkerPayment.name, schema: WorkerPaymentSchema },
      { name: WorkerContract.name, schema: WorkerContractSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: BudgetTransaction.name, schema: BudgetTransactionSchema },
      { name: Budget.name, schema: BudgetSchema },
    ]),
  ],
  controllers: [WorkerPaymentsController],
  providers: [WorkerPaymentsService],
  exports: [WorkerPaymentsService],
})
export class WorkerPaymentsModule {}
