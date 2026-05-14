import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true, collection: 'courses' })
export class Course {
  @ApiProperty({ example: 'Backend Bootcamp', description: 'Course name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'Learn backend', description: 'Course description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 6, description: 'Duration in months (6 or 8)' })
  @Prop({ required: true, enum: [6, 8] })
  duration: number;

  @ApiProperty({ example: 13, description: 'Lessons per month' })
  @Prop({ default: 13 })
  monthLessons: number;

  @ApiProperty({ example: 3, description: 'Lessons per week' })
  @Prop({ default: 3 })
  weekLessons: number;

  @ApiProperty({ example: 2, description: 'Duration time in hours (2 or 4.5)' })
  @Prop({ required: true, enum: [2, 4.5] })
  durationTime: number;

  @ApiProperty({ example: 200000, description: 'Course price' })
  @Prop({ required: true })
  price: number;

  @ApiProperty({ example: 200000, description: 'Course price value' })
  @Prop({ required: true })
  priceValue: number;

  @ApiProperty({ example: 'bootcamp-foundation', description: 'Course type' })
  @Prop({ required: true, enum: ['standart', 'bootcamp-foundation', 'bootcamp-result'] })
  type: string;

  @ApiProperty({ example: 'backend', description: 'Course target' })
  @Prop({ required: true })
  target: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
