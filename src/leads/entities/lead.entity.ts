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
  @Prop({ enum: ['new', 'contacted', 'trial', 'registered', 'lost'], default: 'new' })
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
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
