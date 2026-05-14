import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type HomeworkResultDocument = HydratedDocument<HomeworkResult>;

@Schema({ timestamps: true, collection: 'homework-results' })
export class HomeworkResult {
  @ApiProperty({ example: 'student_homework_id_here', description: 'Student Homework ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'StudentHomework' })
  studentHomeworkId: string;

  @ApiProperty({ example: 'homework_id_here', description: 'Homework ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Homework' })
  homeworkId: string;

  @ApiProperty({ example: 'teacher_id_here', description: 'Teacher ID (Staff)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  teacherId: string;

  @ApiProperty({ example: 95, description: 'Mark (1 to 100)' })
  @Prop({ required: true, min: 0, max: 100 })
  mark: number;

  @ApiProperty({ example: 'Good job!', description: 'Feedback' })
  @Prop({ required: true })
  feedback: string;

  @ApiProperty({ example: 'accepted', description: 'Status' })
  @Prop({ required: true, enum: ['accepted', 'rejected'] })
  status: string;
}

export const HomeworkResultSchema = SchemaFactory.createForClass(HomeworkResult);
