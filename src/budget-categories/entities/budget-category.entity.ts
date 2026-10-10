import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type BudgetCategoryDocument = HydratedDocument<BudgetCategory>;

@Schema({ timestamps: true, collection: 'budget-categories' })
export class BudgetCategory {
  @ApiProperty({ example: 'Salary', description: 'Category name' })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({ example: 'expense', description: 'Type of category' })
  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @ApiProperty({ example: true, description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const BudgetCategorySchema = SchemaFactory.createForClass(BudgetCategory);
