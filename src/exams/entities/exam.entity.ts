import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ timestamps: true, collection: 'exams' })
export class Exam {
  @ApiProperty({ example: 'group_id_here', description: 'Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupId: string;

  @ApiProperty({ example: 'task_id_here', description: 'Task ID (Homework)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Homework' })
  taskId: string;

  @ApiProperty({ example: '2025-01-01T10:00:00Z', description: 'Scheduled Time' })
  @Prop({ required: true })
  scheduled: Date;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Deadline' })
  @Prop({ required: true })
  deadline: Date;

  @ApiProperty({ example: 'scheduled', description: 'Status' })
  @Prop({ required: true, enum: ['scheduled', 'progress', 'completed', 'cancelled'], default: 'scheduled' })
  status: string;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
