import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CourseCompletedStudentDocument = HydratedDocument<CourseCompletedStudent>;

@Schema({ timestamps: true, collection: 'course-completed-students' })
export class CourseCompletedStudent {
  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'group_id_here', description: 'Completed Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  completedGroupId: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Completed Time' })
  @Prop({ required: true })
  completedTime: Date;
}

export const CourseCompletedStudentSchema = SchemaFactory.createForClass(CourseCompletedStudent);
