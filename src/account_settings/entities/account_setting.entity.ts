import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AccountSettingDocument = HydratedDocument<AccountSetting>;

@Schema({ timestamps: true, collection: 'account_settings' })
export class AccountSetting {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'The ID of the user these settings belong to',
  })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Whether notifications are enabled for this account',
  })
  @Prop({ default: true })
  notificationEnabled: boolean;

  @ApiProperty({
    example: 'light',
    description: 'Preferred theme for the application',
    enum: ['light', 'dark'],
  })
  @Prop({ default: 'light' })
  theme: string;

  @ApiProperty({
    example: 'uz',
    description: 'Preferred language for the application',
  })
  @Prop({ default: 'uz' })
  language: string;
}

export const AccountSettingSchema = SchemaFactory.createForClass(AccountSetting);
