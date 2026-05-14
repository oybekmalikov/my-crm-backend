import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type PaymentTypeDocument = HydratedDocument<PaymentType>;

@Schema({ timestamps: true, collection: 'payment-types' })
export class PaymentType {
  @ApiProperty({ example: 'Student Course Fee', description: 'Name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'income', description: 'Type' })
  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @ApiProperty({ example: 'Main income category for students', description: 'Description' })
  @Prop()
  description: string;
}

export const PaymentTypeSchema = SchemaFactory.createForClass(PaymentType);
