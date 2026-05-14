import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'The ID of the user who received the notification',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @ApiProperty({
    example: 'New Message',
    description: 'The title of the notification',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: 'You have a new message from support.',
    description: 'The message content of the notification',
  })
  @Prop({ required: true })
  message: string;

  @ApiProperty({
    example: 'info',
    description: 'The type of notification (info, warning, error, success)',
    enum: ['info', 'warning', 'error', 'success'],
  })
  @Prop({ default: 'info' })
  type: string;

  @ApiProperty({
    example: false,
    description: 'Whether the notification has been read',
  })
  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
