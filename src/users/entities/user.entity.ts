import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { RolesType } from '../../@types';

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
  @Prop({ required: true })
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
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: '+998991234567',
    description: "This user's phone number",
  })
  @Prop({ unique: true, required: true })
  phone: string;

  @ApiProperty({
    example: 'user',
    description: "This user's role",
  })
  @Prop({ required: true })
  role: RolesType;

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
  @Prop({ default: false })
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
  @Prop({ default: '' })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

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

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });
