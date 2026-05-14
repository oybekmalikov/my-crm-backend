import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetTransactionsService } from './budget-transactions.service';
import { BudgetTransactionsController } from './budget-transactions.controller';
import { BudgetTransaction, BudgetTransactionSchema } from './entities/budget-transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: BudgetTransaction.name, schema: BudgetTransactionSchema }]),
  ],
  controllers: [BudgetTransactionsController],
  providers: [BudgetTransactionsService],
})
export class BudgetTransactionsModule {}
