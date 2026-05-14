import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SupportDocument = HydratedDocument<Support>;

@Schema({ timestamps: true, collection: 'support' })
export class Support {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'The ID of the user who sent the support request',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  senderId: string;

  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d2',
    description: 'The ID of the staff/admin who received the support request',
  })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  reciptId: string;

  @ApiProperty({
    example: 'I have an issue with my payment.',
    description: 'The content of the support message',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    example: 'https://example.com/issue.jpg',
    description: 'Optional image URL for the support request',
  })
  @Prop({ default: '' })
  imageUrl: string;

  @ApiProperty({
    example: false,
    description: 'Whether the message has been edited',
  })
  @Prop({ default: false })
  isEdited: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the message has been deleted',
  })
  @Prop({ default: false })
  isDeleted: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the message has been viewed',
  })
  @Prop({ default: false })
  isViewed: boolean;

  @ApiProperty({
    example: 'Original message content',
    description: 'The original content if the message was edited',
  })
  @Prop({ default: '' })
  originalContent: string;
}

export const SupportSchema = SchemaFactory.createForClass(Support);

SupportSchema.virtual('senderUser', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

SupportSchema.virtual('reciptUser', {
  ref: 'User',
  localField: 'reciptId',
  foreignField: '_id',
  justOne: true,
});

SupportSchema.set('toJSON', { virtuals: true });
SupportSchema.set('toObject', { virtuals: true });
