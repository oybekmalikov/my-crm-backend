import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type WorkerContractDocument = HydratedDocument<WorkerContract>;

@Schema({ timestamps: true, collection: 'worker-contracts' })
export class WorkerContract {
  @ApiProperty({ example: 'contract_id_here', description: 'Contract ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Contract' })
  contractId: string;

  @ApiProperty({ example: 'worker_id_here', description: 'Worker ID (Staff)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  workerId: string;

  @ApiProperty({ example: 'Software Engineer', description: 'Position' })
  @Prop({ required: true })
  position: string;

  @ApiProperty({ example: 10000000, description: 'Base Salary' })
  @Prop({ required: true })
  baseSalary: number;

  @ApiProperty({ example: '{"KPI": 500000}', description: 'Bonus Structure' })
  @Prop()
  bonusStructure: string;

  @ApiProperty({ example: true, description: 'Is Active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const WorkerContractSchema = SchemaFactory.createForClass(WorkerContract);
