import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type HomeworkDocument = HydratedDocument<Homework>;

@Schema({ timestamps: true, collection: 'homeworks' })
export class Homework {
  @ApiProperty({ example: 'lesson_id_here', description: 'Lesson ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Lesson' })
  lessonId: string;

  @ApiProperty({ example: 'teacher_id_here', description: 'Teacher ID (Staff)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  teacherId: string;

  @ApiProperty({ example: 'Complete exercises 1 to 5', description: 'Homework description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Deadline' })
  @Prop({ required: true })
  deadline: Date;
}

export const HomeworkSchema = SchemaFactory.createForClass(Homework);
