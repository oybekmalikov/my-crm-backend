import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ParentDocument = HydratedDocument<Parent>;

@Schema({ timestamps: true, collection: 'parents' })
export class Parent {
  @ApiProperty({ example: 'user_id_here', description: 'Parent user id' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User', unique: true })
  userId: string;

  @ApiProperty({ example: ['student_id_here'], description: 'Linked children student ids' })
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Student' }], default: [] })
  studentIds: string[];

  @ApiProperty({ example: true, description: 'Parent portal activity' })
  @Prop({ default: true })
  isActive: boolean;
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
