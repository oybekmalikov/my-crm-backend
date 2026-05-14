import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true, collection: 'attendances' })
export class Attendance {
  @ApiProperty({ example: 'group_id_here', description: 'Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupId: string;

  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'lesson_id_here', description: 'Lesson ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Lesson' })
  lessonId: string;

  @ApiProperty({ example: true, description: 'Attendance status' })
  @Prop({ required: true })
  status: boolean;

  @ApiProperty({ example: 0, description: 'Late minutes' })
  @Prop({ default: 0 })
  lateMinute: number;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
