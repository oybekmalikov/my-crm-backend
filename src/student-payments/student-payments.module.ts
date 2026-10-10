import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentPaymentsService } from './student-payments.service';
import { StudentPaymentsController } from './student-payments.controller';
import { StudentPayment, StudentPaymentSchema } from './entities/student-payment.entity';
import { BudgetTransaction, BudgetTransactionSchema } from '../budget-transactions/entities/budget-transaction.entity';
import { Budget, BudgetSchema } from '../budgets/entities/budget.entity';
import { StudentsContract, StudentsContractSchema } from '../students-contracts/entities/students-contract.entity';
import { Student, StudentSchema } from '../students/entities/student.entity';
import { User, UserSchema } from '../users/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentPayment.name, schema: StudentPaymentSchema },
      { name: BudgetTransaction.name, schema: BudgetTransactionSchema },
      { name: Budget.name, schema: BudgetSchema },
      { name: StudentsContract.name, schema: StudentsContractSchema },
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    NotificationsModule,
    CommonModule,
  ],
  controllers: [StudentPaymentsController],
  providers: [StudentPaymentsService],
  exports: [StudentPaymentsService],
})
export class StudentPaymentsModule {}
