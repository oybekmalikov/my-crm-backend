import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BudgetTransactionDocument = HydratedDocument<BudgetTransaction>;

@Schema({ timestamps: true, collection: 'budget-transactions' })
export class BudgetTransaction {
  @ApiProperty({ example: 'budget_id_here', description: 'Budget ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Budget' })
  budgetId: string;

  @ApiProperty({ example: 'payment_type_id_here', description: 'Payment Type ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'PaymentType' })
  categoryId: string;

  @ApiProperty({ example: 'student_login_123', description: 'Source ID/Login' })
  @Prop()
  source: string;

  @ApiProperty({ example: 'income', description: 'Target' })
  @Prop({ required: true, enum: ['income', 'expense'] })
  target: string;

  @ApiProperty({ example: 400000, description: 'Total Sum' })
  @Prop({ required: true })
  totalSum: number;

  @ApiProperty({ example: 'Student paid monthly fee', description: 'Description' })
  @Prop()
  description: string;

  @ApiProperty({ example: 'staff_id_here', description: 'Created By (Staff)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  createdBy: string;

  @ApiProperty({ example: 'completed', description: 'Status' })
  @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' })
  status: string;

  @ApiProperty({ example: false, description: 'Is Deleted' })
  @Prop({ default: false })
  isDeleted: boolean;
}

export const BudgetTransactionSchema = SchemaFactory.createForClass(BudgetTransaction);
