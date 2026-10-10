import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type CoursePlanDocument = HydratedDocument<CoursePlan>;

@Schema({ timestamps: true, collection: 'course-plans' })
export class CoursePlan {
  @ApiProperty({ example: 'Standard Backend Plan', description: 'Name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 2000000, description: 'Base Price' })
  @Prop({ required: true })
  basePrice: number;

  @ApiProperty({ example: 400000, description: 'Monthly Price' })
  @Prop({ required: true })
  monthlyPrice: number;

  @ApiProperty({ example: 1100000, description: 'Half Course Price' })
  @Prop({ required: true })
  halfCoursePrice: number;

  @ApiProperty({ example: 2000000, description: 'Full Course Price' })
  @Prop({ required: true })
  fullCoursePrice: number;

  @ApiProperty({ example: 10, description: 'Discount percentage (optional)' })
  @Prop({ default: 0 })
  discount: number;

  @ApiProperty({ example: true, description: 'Is Active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const CoursePlanSchema = SchemaFactory.createForClass(CoursePlan);
