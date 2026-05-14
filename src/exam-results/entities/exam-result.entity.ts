import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ExamResultDocument = HydratedDocument<ExamResult>;

@Schema({ timestamps: true, collection: 'exam-results' })
export class ExamResult {
  @ApiProperty({ example: 'exam_id_here', description: 'Exam ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Exam' })
  examId: string;

  @ApiProperty({ example: 'work_id_here', description: 'Work ID (StudentHomework)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'StudentHomework' })
  workId: string;

  @ApiProperty({ example: 'teacher_id_here', description: 'Teacher ID (Staff)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  teacherId: string;

  @ApiProperty({ example: 95, description: 'Mark (1 to 100)' })
  @Prop({ required: true, min: 0, max: 100 })
  mark: number;

  @ApiProperty({ example: 'Excellent performance.', description: 'Feedback' })
  @Prop({ required: true })
  feedback: string;

  @ApiProperty({ example: true, description: 'Is Accepted' })
  @Prop({ required: true, default: false })
  isAccepted: boolean;
}

export const ExamResultSchema = SchemaFactory.createForClass(ExamResult);
