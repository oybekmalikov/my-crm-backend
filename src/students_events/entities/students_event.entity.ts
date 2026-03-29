import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types, HydratedDocument } from 'mongoose';

export type StudentsEventDocument = HydratedDocument<StudentsEvent>;

@Schema({ timestamps: true, collection: 'students_events' })
export class StudentsEvent {
  @ApiProperty({
    example: '60d...',
    description: "This is the student's ID number",
  })
  @Prop({ type: Types.ObjectId, ref: 'Student', required: true })
  studentId: Types.ObjectId;

  @ApiProperty({
    example: '60d...',
    description: "This is the event's ID number",
  })
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;

  @ApiProperty({
    example: true,
    description: "This is the student's attendance status",
  })
  @Prop({ default: false })
  isAttended: boolean;
}

export const StudentsEventSchema = SchemaFactory.createForClass(StudentsEvent);

StudentsEventSchema.virtual('student', {
  ref: 'Student',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true,
});

StudentsEventSchema.virtual('event', {
  ref: 'Event',
  localField: 'eventId',
  foreignField: '_id',
  justOne: true,
});

StudentsEventSchema.set('toJSON', { virtuals: true });
StudentsEventSchema.set('toObject', { virtuals: true });
