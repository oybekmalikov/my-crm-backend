import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StudentWorkingDocument = HydratedDocument<StudentWorking>;

@Schema({ timestamps: true, collection: 'students-working' })
export class StudentWorking {
  @ApiProperty({ example: 'completed_id_here', description: 'Course Completed Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'CourseCompletedStudent' })
  completedId: string;

  @ApiProperty({ example: 'Google', description: 'Company Name' })
  @Prop({ required: true })
  companyName: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Start Date' })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'End Date' })
  @Prop({ required: false })
  endDate?: Date;

  @ApiProperty({ example: true, description: 'Is Working' })
  @Prop({ required: true, default: true })
  isWorking: boolean;

  @ApiProperty({ example: 'Backend Developer', description: 'Position' })
  @Prop({ required: true })
  position: string;

  @ApiProperty({ example: 1000, description: 'Salary' })
  @Prop({ required: true })
  salary: number;
}

export const StudentWorkingSchema = SchemaFactory.createForClass(StudentWorking);
