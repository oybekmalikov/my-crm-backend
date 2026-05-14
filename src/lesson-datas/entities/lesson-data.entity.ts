import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type LessonDataDocument = HydratedDocument<LessonData>;

@Schema({ timestamps: true, collection: 'lesson-datas' })
export class LessonData {
  @ApiProperty({ example: 'lesson_id_here', description: 'Lesson ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Lesson' })
  lessonId: string;

  @ApiProperty({ example: 'homework', description: 'Key' })
  @Prop({ required: true })
  key: string;

  @ApiProperty({ example: 'done', description: 'Value' })
  @Prop({ required: true })
  value: string;
}

export const LessonDataSchema = SchemaFactory.createForClass(LessonData);
