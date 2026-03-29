import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types, HydratedDocument } from 'mongoose';

export type StaffDocument = HydratedDocument<Staff>;

@Schema({ timestamps: true, collection: 'staffs' })
export class Staff {
  @ApiProperty({
    example: '60d...',
    description: "This is the user's ID from users table",
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    example: '2005-05-15',
    description: "This is the staff's date of birth",
  })
  @Prop({ required: true })
  dateOfBirth: string;

  @ApiProperty({
    example: 'Bringham 67, New York',
    description: "This is the staff's address",
  })
  @Prop({ required: true })
  address: string;

  @ApiProperty({
    example: 'male',
    description: "This is the staff's gender type",
  })
  @Prop({ required: true })
  gender: string;

  @ApiProperty({ example: 5000000, description: "This is the staff's salary" })
  @Prop({ required: true })
  salary: number;

  @ApiProperty({
    example: true,
    description: 'This is the salary paid for last month or not',
  })
  @Prop({ default: false })
  salary_paid_for_last_month: boolean;

  @ApiProperty({
    example: 'Manager',
    description: "This is the staff's position",
  })
  @Prop({ unique: true, required: true })
  position: string;

  @ApiProperty({
    example: true,
    description: "This is the staff's activity status",
  })
  @Prop({ default: false })
  isActive: boolean;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

StaffSchema.set('toJSON', { virtuals: true });
StaffSchema.set('toObject', { virtuals: true });
