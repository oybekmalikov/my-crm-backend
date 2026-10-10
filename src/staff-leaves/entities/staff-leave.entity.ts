import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type StaffLeaveDocument = HydratedDocument<StaffLeave>;

@Schema({ timestamps: true, collection: 'staff_leaves' })
export class StaffLeave {
  @ApiProperty({ example: '60d...', description: 'Staff ID' })
  @Prop({ type: Types.ObjectId, ref: 'Staff', required: true })
  staffId: Types.ObjectId;

  @ApiProperty({ example: '2025-06-01', description: 'Leave start date (ISO date string)' })
  @Prop({ required: true })
  startDate: string;

  @ApiProperty({ example: '2025-06-07', description: 'Leave end date (ISO date string)' })
  @Prop({ required: true })
  endDate: string;

  @ApiProperty({ example: 'Annual vacation', description: 'Reason for leave' })
  @Prop({ required: true })
  reason: string;

  @ApiProperty({ example: 'PENDING', description: 'Leave request status', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @Prop({ enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' })
  status: string;

  @ApiProperty({ example: 'Approved — enjoy your vacation', description: 'Optional admin note on decision' })
  @Prop({ type: String, default: null })
  adminNote: string | null;

  @ApiProperty({ example: '60d...', description: 'Admin/Superadmin user ID who acted on the request' })
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  decidedBy: Types.ObjectId | null;
}

export const StaffLeaveSchema = SchemaFactory.createForClass(StaffLeave);

StaffLeaveSchema.virtual('staff', {
  ref: 'Staff',
  localField: 'staffId',
  foreignField: '_id',
  justOne: true,
});

StaffLeaveSchema.set('toJSON', { virtuals: true });
StaffLeaveSchema.set('toObject', { virtuals: true });
