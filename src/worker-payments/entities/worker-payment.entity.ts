import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type WorkerPaymentDocument = HydratedDocument<WorkerPayment>;

@Schema({ timestamps: true, collection: 'worker-payments' })
export class WorkerPayment {
  @ApiProperty({ example: 'worker_contract_id_here', description: 'Worker Contract ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'WorkerContract' })
  workerContractId: string;

  @ApiProperty({ example: 10000000, description: 'Amount' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Payment Date' })
  @Prop({ type: Date, default: null })
  paymentDate: Date | null;

  @ApiProperty({ example: 'card', description: 'Payment Type' })
  @Prop({ default: '' })
  paymentType: string;

  @ApiProperty({ example: 'January Salary', description: 'Notes' })
  @Prop()
  notes: string;

  @ApiProperty({ example: 'completed', description: 'Status' })
  @Prop({ required: true, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' })
  status: string;

  @ApiProperty({ example: 2025, description: 'Payroll year' })
  @Prop({ default: null, type: Number })
  payrollYear: number | null;

  @ApiProperty({ example: 1, description: 'Payroll month (1-12)' })
  @Prop({ default: null, type: Number })
  payrollMonth: number | null;

  @ApiProperty({ example: false, description: 'Is Deleted (Soft delete)' })
  @Prop({ default: false })
  isDeleted: boolean;
}

export const WorkerPaymentSchema = SchemaFactory.createForClass(WorkerPayment);
