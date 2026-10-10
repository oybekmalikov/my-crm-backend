import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type SyllabusDocument = HydratedDocument<Syllabus>;

@Schema({ timestamps: true, collection: 'syllabuses' })
export class Syllabus {
  @ApiProperty({ example: 'Introduction to Node.js', description: 'Module/Topic name' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Learn basics of Node.js', description: 'Description' })
  @Prop()
  description: string;

  @ApiProperty({ example: '64b0f...', description: 'Course ID' })
  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @ApiProperty({ example: 1, description: 'Order of the module' })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({ example: ['Introduction', 'Installation'], description: 'List of topics' })
  @Prop({ type: [String] })
  lessons: string[];
}

export const SyllabusSchema = SchemaFactory.createForClass(Syllabus);
