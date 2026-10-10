import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type GroupTeacherDocument = HydratedDocument<GroupTeacher>;

@Schema({ timestamps: true, collection: 'group-teachers' })
export class GroupTeacher {
  @ApiProperty({ example: 'group_id_here', description: 'Group ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupId: string;

  @ApiProperty({ example: 'teacher_id_here', description: 'Teacher (Staff) ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  teacherId: string;

  @ApiProperty({ example: true, description: 'Status' })
  @Prop({ required: true, default: true })
  status: boolean;
}

export const GroupTeacherSchema = SchemaFactory.createForClass(GroupTeacher);
