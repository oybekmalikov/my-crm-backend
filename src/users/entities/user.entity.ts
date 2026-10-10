import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @ApiProperty({
    example: 'Ali',
    description: "This is the user's first name",
  })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({
    example: 'Aliyev',
    description: "This is the user's last name",
  })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({
    example: 'Aliyevich',
    description: "This is the user's middle name",
  })
  @Prop({})
  middleName: string;

  @ApiProperty({
    example: 'ali-aliyev',
    description: "This user's login name",
  })
  @Prop({ unique: true, required: true })
  login: string;

  @ApiProperty({
    example: 'example1234',
    description: "This user's password",
  })
  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty({
    example: '+998991234567',
    description: "This user's phone number",
  })
  @Prop({ unique: true })
  phone: string;

  @ApiProperty({
    example: 'ali.aliyev@example.com',
    description:
      "This user's email address. Optional, but required for password-reset emails and payment/notification emails.",
  })
  @Prop({ type: String, default: null, sparse: true, unique: true })
  email?: string | null;

  @ApiProperty({
    example: 'USER',
    description: "This user's role",
  })
  @Prop({ required: true })
  role: string;

  @ApiProperty({
    example: '/src/something/avatar.jpg',
    description: "This user's avatar path.",
  })
  @Prop({ default: '' })
  avatarUrl: string;

  @ApiProperty({
    example: true,
    description: "This user's activity",
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2023-01-01 12:00:00',
    description: "This user's last activity",
  })
  @Prop({ default: '' })
  lastLogin?: string;

  @ApiProperty({
    example: 'qwertyu.12345.!@#$%^&*',
    description: "This is the user's token.",
  })
  @Prop({ default: '', select: false })
  refreshToken: string;

  @ApiProperty({
    example: 0,
    description: 'Number of consecutive failed login attempts.',
  })
  @Prop({ default: 0, select: false })
  failedLoginAttempts: number;

  @ApiProperty({
    example: null,
    description: 'If set and in the future, the account is locked until this time.',
  })
  @Prop({ type: Date, default: null, select: false })
  lockedUntil: Date | null;

  @ApiProperty({
    example: null,
    description: 'Hashed password-reset token, only set while a reset is pending.',
  })
  @Prop({ type: String, default: null, select: false })
  passwordResetTokenHash: string | null;

  @ApiProperty({
    example: null,
    description: 'Expiry time for the pending password-reset token.',
  })
  @Prop({ type: Date, default: null, select: false })
  passwordResetExpires: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Never leak credentials/tokens through JSON/object serialization, even if a
// query forgets to exclude them.
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.__v;
    return ret;
  },
});
UserSchema.set('toObject', {
  virtuals: true,
  transform: (_doc, ret: Record<string, any>) => {
    delete ret.password;
    delete ret.refreshToken;
    delete ret.__v;
    return ret;
  },
});

UserSchema.virtual('students', {
  ref: 'Student',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.virtual('staffs', {
  ref: 'Staff',
  localField: '_id',
  foreignField: 'userId',
});
