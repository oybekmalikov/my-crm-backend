import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StudentPaymentDocument = HydratedDocument<StudentPayment>;

@Schema({ timestamps: true, collection: 'student-payments' })
export class StudentPayment {
  @ApiProperty({ example: 'offer_id_here', description: 'Offer ID (StudentsContract)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'StudentsContract' })
  offerId: string;

  @ApiProperty({ example: 400000, description: 'Payment Amount' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Payment Date' })
  @Prop({ required: true })
  paymentDate: Date;

  @ApiProperty({ example: 'cash', description: 'Payment Type (card, cash, etc.)' })
  @Prop({ required: true })
  paymentType: string;

  @ApiProperty({ example: 'January Salary', description: 'Notes' })
  @Prop()
  notes: string;

  @ApiProperty({ example: 'completed', description: 'Status' })
  @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' })
  status: string;

  @ApiProperty({ example: false, description: 'Is Deleted (Soft delete)' })
  @Prop({ default: false })
  isDeleted: boolean;
}

export const StudentPaymentSchema = SchemaFactory.createForClass(StudentPayment);
