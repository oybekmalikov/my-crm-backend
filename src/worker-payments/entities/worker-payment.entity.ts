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
  @Prop({ required: true })
  paymentDate: Date;

  @ApiProperty({ example: 'card', description: 'Payment Type' })
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

export const WorkerPaymentSchema = SchemaFactory.createForClass(WorkerPayment);
