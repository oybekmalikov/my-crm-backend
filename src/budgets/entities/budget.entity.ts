import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema({ timestamps: true, collection: 'budgets' })
export class Budget {
  @ApiProperty({ example: 2025, description: 'Year' })
  @Prop({ required: true })
  year: number;

  @ApiProperty({ example: 1, description: 'Month (1-12)' })
  @Prop({ required: true, min: 1, max: 12 })
  month: number;

  @ApiProperty({ example: 15000000, description: 'Total Income' })
  @Prop({ required: true, default: 0 })
  totalIncome: number;

  @ApiProperty({ example: 10000000, description: 'Total Expense' })
  @Prop({ required: true, default: 0 })
  totalExpense: number;

  @ApiProperty({ example: 5000000, description: 'Net Balance' })
  @Prop({ required: true, default: 0 })
  netBalance: number;

  @ApiProperty({ example: 'January 2025 Budget Report', description: 'Description' })
  @Prop()
  description: string;

  @ApiProperty({ example: 'staff_id_here', description: 'Created By (Staff)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  createdBy: string;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
