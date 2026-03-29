import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types, HydratedDocument } from 'mongoose';

export type SupportDocument = HydratedDocument<Support>;

@Schema({ timestamps: true, collection: 'support' })
export class Support {
  @ApiProperty({
    example: '60d...',
    description: 'This is the sender ID number.',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;

  @ApiProperty({
    example: '60d...',
    description: 'This is the recipt ID number.',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reciptId: Types.ObjectId;

  @ApiProperty({
    example: 'Assalomu alaykum, how can I help you?',
    description: 'The content whta user or admin want from each other.',
  })
  @Prop({ required: true })
  content: string;

  @ApiProperty({
    example: '/support/...',
    description: 'This is additional picture for report or issue.',
  })
  @Prop({ required: true })
  imageUrl: string;

  @ApiProperty({ example: true, description: 'Is user edited his report.' })
  @Prop({ required: true })
  isEdited: boolean;

  @ApiProperty({ example: true, description: 'Is user deleted his report.' })
  @Prop({ required: true })
  isDeleted: boolean;

  @ApiProperty({ example: true, description: 'Is message viewed ?' })
  @Prop({ required: true })
  isViewed: boolean;

  @ApiProperty({
    example: 'original',
    description: 'If user edited his report, orginal content saved.',
  })
  @Prop({ required: true })
  originalContent: string;
}

export const SupportSchema = SchemaFactory.createForClass(Support);

SupportSchema.virtual('senderUser', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true,
});

SupportSchema.virtual('reciptrUser', {
  ref: 'User',
  localField: 'reciptId',
  foreignField: '_id',
  justOne: true,
});

SupportSchema.set('toJSON', { virtuals: true });
SupportSchema.set('toObject', { virtuals: true });
