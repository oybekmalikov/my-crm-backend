import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ContractDocument = HydratedDocument<Contract>;

@Schema({ timestamps: true, collection: 'contracts' })
export class Contract {
  @ApiProperty({ example: 'Standard Student Contract', description: 'Name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Must pay in time...', description: 'Terms' })
  @Prop({ required: true })
  terms: string;

  @ApiProperty({ example: 'No special notes', description: 'Notes' })
  @Prop()
  notes: string;

  @ApiProperty({ example: 'student', description: 'Type of contract' })
  @Prop({ required: true, enum: ['worker', 'student'] })
  type: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', description: 'Start Date' })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({ example: '2026-01-01T00:00:00Z', description: 'End Date' })
  @Prop({ required: true })
  endDate: Date;

  @ApiProperty({ example: '/files/contract1.pdf', description: 'File Path' })
  @Prop()
  filePath: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
