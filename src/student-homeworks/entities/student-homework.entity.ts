import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StudentHomeworkDocument = HydratedDocument<StudentHomework>;

@Schema({ timestamps: true, collection: 'student-homeworks' })
export class StudentHomework {
  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'homework_id_here', description: 'Homework ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Homework' })
  homeworkId: string;

  @ApiProperty({ example: 'Here is my solution...', description: 'Description' })
  @Prop({ required: true })
  description: string;
}

export const StudentHomeworkSchema = SchemaFactory.createForClass(StudentHomework);
