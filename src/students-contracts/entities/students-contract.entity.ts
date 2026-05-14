import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type StudentsContractDocument = HydratedDocument<StudentsContract>;

@Schema({ timestamps: true, collection: 'students-contracts' })
export class StudentsContract {
  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'contract_id_here', description: 'Contract ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Contract' })
  contractId: string;

  @ApiProperty({ example: 'course_id_here', description: 'Course ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  courseId: string;

  @ApiProperty({ example: 'monthly', description: 'Selected Plan' })
  @Prop({ required: true, enum: ['monthly', 'half', 'full'] })
  selectedPlan: string;

  @ApiProperty({ example: 350000, description: 'Custom Discount/Price (Optional)' })
  @Prop()
  customDiscount: number;

  @ApiProperty({ example: true, description: 'Is Active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const StudentsContractSchema = SchemaFactory.createForClass(StudentsContract);
