import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types, HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true, collection: 'students' })
export class Student {
  @ApiProperty({
    example: '60d...',
    description: 'This is the students userId number.',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    example: '2005-05-15',
    description: 'This is the students date of birth',
  })
  @Prop({ required: true })
  dateOfBirth: string;

  @ApiProperty({
    example: 'male',
    description: 'This is the students gender type',
  })
  @Prop({ required: true })
  gender: string;

  @ApiProperty({
    example: 'Manhattan st-10, New York',
    description: 'This students full address',
  })
  @Prop({ required: true })
  address: string;

  @ApiProperty({ example: true, description: 'This students activity' })
  @Prop({ default: false })
  isActive: boolean;

  @ApiProperty({ example: 568, description: 'This students xp value' })
  @Prop({ default: 0 })
  xp: number;

  @ApiProperty({ example: 10256, description: 'This students point value' })
  @Prop({ default: 0 })
  point: number;

  @ApiProperty({
    example: 56,
    description: 'This students avarage mark: interval 0-100',
  })
  @Prop({ default: 0 })
  avarageMark: number;

  @ApiProperty({ example: 5, description: 'This students study level' })
  @Prop({ default: 1 })
  level: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

StudentSchema.virtual('events', {
  ref: 'StudentsEvent',
  localField: '_id',
  foreignField: 'studentId',
});

StudentSchema.set('toJSON', { virtuals: true });
StudentSchema.set('toObject', { virtuals: true });
