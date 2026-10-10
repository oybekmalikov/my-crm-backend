import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({ timestamps: true, collection: 'leads' })
export class Lead {
  @ApiProperty({ example: 'John', description: 'First Name' })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last Name' })
  @Prop()
  lastName: string;

  @ApiProperty({ example: '+998901234567', description: 'Phone Number' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ example: 'course_id_here', description: 'Interested Course ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @ApiProperty({ example: 'instagram', description: 'Source' })
  @Prop({ enum: ['telegram', 'instagram', 'website', 'friend', 'other'], default: 'other' })
  source: string;

  @ApiProperty({ example: 'new', description: 'Lead Status' })
  @Prop({ enum: ['new', 'contacted', 'trial', 'registered', 'lost', 'converted'], default: 'new' })
  status: string;

  @ApiProperty({ example: 'Wants to study in the evening', description: 'Notes / Questions' })
  @Prop()
  notes: string;

  @ApiProperty({ example: 'staff_id_here', description: 'Assigned Admin (Staff)' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  assignedTo: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Next Contact Date' })
  @Prop()
  nextContactDate: Date;

  @ApiProperty({ example: 'student_id_here', description: 'Linked Student ID after conversion' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Student', default: null })
  studentId: string | null;

  @ApiProperty({ example: 35, description: 'Lead score (0-100) based on activity and status' })
  @Prop({ default: 0, min: 0, max: 100 })
  score: number;

  @ApiProperty({ example: 'warm', description: 'Lead interest bucket derived from score' })
  @Prop({ enum: ['cold', 'warm', 'hot'], default: 'cold' })
  scoreLevel: string;

  @ApiProperty({
    example: '2026-07-08T10:25:00Z',
    description: 'Latest tracked CRM interaction date',
    required: false,
  })
  @Prop({ type:String ,default: null })
  lastActivityAt: Date | null;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
