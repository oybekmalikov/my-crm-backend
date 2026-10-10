import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StudentsProductDocument = HydratedDocument<StudentsProduct>;

@Schema({ timestamps: true, collection: 'students-products' })
export class StudentsProduct {
  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'product_id_here', description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ example: 2, description: 'Purchased quantity' })
  @Prop({ default: 1, min: 1 })
  quantity: number;

  @ApiProperty({ example: 'cash', description: 'Payment method' })
  @Prop({ enum: ['cash', 'card', 'click', 'xp'], default: 'cash' })
  paymentMethod: string;

  @ApiProperty({ example: 240000, description: 'Total amount in money' })
  @Prop({ default: 0, min: 0 })
  totalAmount: number;

  @ApiProperty({ example: 600, description: 'Spent student points' })
  @Prop({ default: 0, min: 0 })
  spentPoint: number;

  @ApiProperty({ example: 'completed', description: 'Purchase status' })
  @Prop({ enum: ['completed', 'cancelled', 'refunded'], default: 'completed' })
  status: string;
}

export const StudentsProductSchema = SchemaFactory.createForClass(StudentsProduct);
