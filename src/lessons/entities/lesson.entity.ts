import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true, collection: 'lessons' })
export class Lesson {
  @ApiProperty({ example: 'Lesson 1', description: 'Title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Introduction', description: 'Description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 'group_id_here', description: 'Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupId: string;

  @ApiProperty({ example: 'room_id_here', description: 'Room ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', default: null })
  roomId: string | null;

  @ApiProperty({ example: 'scheduled', description: 'Status' })
  @Prop({
    required: true,
    enum: ['scheduled', 'progress', 'completed', 'cancelled'],
    default: 'scheduled',
  })
  status: string;

  @ApiProperty({ example: '2025-01-01', description: 'Date' })
  @Prop({ required: true })
  date: string;

  @ApiProperty({ example: '09:00', description: 'Start time (HH:mm)' })
  @Prop({ type: String, default: null })
  startTime: string | null;

  @ApiProperty({ example: '11:00', description: 'End time (HH:mm)' })
  @Prop({ type: String, default: null })
  endTime: string | null;

  @ApiProperty({ example: 'lesson', description: 'Type' })
  @Prop({ required: true, enum: ['lesson', 'exam'], default: 'lesson' })
  type: string;

  @ApiProperty({ description: 'Reason for cancellation' })
  @Prop({ type: String, default: null })
  cancellationReason: string | null;

  @ApiProperty({ description: 'Staff who cancelled the lesson' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', default: null })
  cancelledBy: string | null;

  @ApiProperty({ description: 'Substitute teacher for this lesson' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', default: null })
  substituteTeacherId: string | null;

  @ApiProperty({ description: 'History of date/time reschedules' })
  @Prop({
    type: [
      {
        previousDate: String,
        previousStartTime: String,
        previousEndTime: String,
        rescheduledAt: { type: Date, default: Date.now },
        rescheduledBy: { type: MongooseSchema.Types.ObjectId, ref: 'Staff' },
      },
    ],
    default: [],
  })
  rescheduleHistory: Array<{
    previousDate: string;
    previousStartTime: string | null;
    previousEndTime: string | null;
    rescheduledAt: Date;
    rescheduledBy: string;
  }>;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
