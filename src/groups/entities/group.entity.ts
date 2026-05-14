import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true, collection: 'groups' })
export class Group {
  @ApiProperty({ example: 'G-1', description: 'Group name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'course_id_here', description: 'Course ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @ApiProperty({ example: 'branch_id_here', description: 'Branch ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branchId: string;

  @ApiProperty({ example: '2025-01-01', description: 'Start date' })
  @Prop({ required: true })
  startDate: string;

  @ApiProperty({ example: '2025-07-01', description: 'End date' })
  @Prop({ required: true })
  endDate: string;

  @ApiProperty({ example: '16:00', description: 'Start time' })
  @Prop({ required: true })
  startTime: string;

  @ApiProperty({ example: '18:00', description: 'End time' })
  @Prop({ required: true })
  endTime: string;

  @ApiProperty({ example: 'new', description: 'Group status' })
  @Prop({ required: true, enum: ['new', 'active', 'completed'], default: 'new' })
  status: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
