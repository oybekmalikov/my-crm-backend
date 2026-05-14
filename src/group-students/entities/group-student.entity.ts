import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type GroupStudentDocument = HydratedDocument<GroupStudent>;

@Schema({ timestamps: true, collection: 'group-students' })
export class GroupStudent {
  @ApiProperty({ example: 'group_id_here', description: 'Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupId: string;

  @ApiProperty({ example: 'student_id_here', description: 'Student ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Student' })
  studentId: string;

  @ApiProperty({ example: 'studying', description: 'Status' })
  @Prop({ required: true, enum: ['studying', 'completed', 'excluded'], default: 'studying' })
  status: string;
}

export const GroupStudentSchema = SchemaFactory.createForClass(GroupStudent);
