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
  @Prop({ type: Date, default: null })
  paymentDate: Date | null;

  @ApiProperty({ example: '2025-01-31T23:59:59Z', description: 'Due Date for this installment' })
  @Prop({ type: Date, default: null })
  dueDate: Date | null;

  @ApiProperty({ example: 'cash', description: 'Payment Type (card, cash, etc.)' })
  @Prop({ default: '' })
  paymentType: string;

  @ApiProperty({ example: 'January Salary', description: 'Notes' })
  @Prop()
  notes: string;

  @ApiProperty({ example: 'completed', description: 'Status' })
  @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded', 'overdue'], default: 'pending' })
  status: string;

  @ApiProperty({ example: 1, description: 'Installment number (1-based)' })
  @Prop({ default: 1 })
  installmentNumber: number;

  @ApiProperty({ example: false, description: 'Is Deleted (Soft delete)' })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({ example: 'RCP-20250708-0042', description: 'Unique receipt number' })
  @Prop({ type: String, unique: true, sparse: true, default: null })
  receiptNumber: string | null;
}

export const StudentPaymentSchema = SchemaFactory.createForClass(StudentPayment);
