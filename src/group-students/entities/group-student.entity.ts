import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type GroupStudentDocument = HydratedDocument<GroupStudent>;

@Schema({ timestamps: true, collection: 'group-students' })
export class GroupStudent {
  @ApiProperty({ example: 'group_id_here', description: 'Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupId: string;

  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'studying', description: 'Status' })
  @Prop({ required: true, enum: ['studying', 'completed', 'excluded', 'waitlisted'], default: 'studying' })
  status: string;

  @ApiProperty({ example: 'To\'lov qilmadi', description: 'Reason for exclusion' })
  @Prop({ type: String, default: null })
  exclusionReason: string | null;

  @ApiProperty({ description: 'When the student was excluded' })
  @Prop({ type: Date, default: null })
  excludedAt: Date | null;

  @ApiProperty({ description: 'Staff who excluded the student' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', default: null })
  excludedBy: string | null;

  @ApiProperty({ description: 'Previous group when transferred' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', default: null })
  transferredFromGroupId: string | null;
}

export const GroupStudentSchema = SchemaFactory.createForClass(GroupStudent);
