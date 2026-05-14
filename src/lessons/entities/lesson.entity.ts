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
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Room' })
  roomId: string;

  @ApiProperty({ example: 'scheduled', description: 'Status' })
  @Prop({ required: true, enum: ['scheduled', 'progress', 'completed', 'cancelled'], default: 'scheduled' })
  status: string;

  @ApiProperty({ example: '2025-01-01', description: 'Date' })
  @Prop({ required: true })
  date: string;

  @ApiProperty({ example: 'lesson', description: 'Type' })
  @Prop({ required: true, enum: ['lesson', 'exam'], default: 'lesson' })
  type: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
