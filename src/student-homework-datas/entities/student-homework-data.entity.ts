import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StudentHomeworkDataDocument = HydratedDocument<StudentHomeworkData>;

@Schema({ timestamps: true, collection: 'student-homework-datas' })
export class StudentHomeworkData {
  @ApiProperty({ example: 'student_homework_id_here', description: 'Student Homework ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'StudentHomework' })
  studentHomeworkId: string;

  @ApiProperty({ example: 'fileUrl', description: 'Key' })
  @Prop({ required: true })
  key: string;

  @ApiProperty({ example: 'https://example.com/solution.pdf', description: 'Value' })
  @Prop({ required: true })
  value: string;
}

export const StudentHomeworkDataSchema = SchemaFactory.createForClass(StudentHomeworkData);
