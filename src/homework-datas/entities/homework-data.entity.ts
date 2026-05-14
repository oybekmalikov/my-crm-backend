import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type HomeworkDataDocument = HydratedDocument<HomeworkData>;

@Schema({ timestamps: true, collection: 'homework-datas' })
export class HomeworkData {
  @ApiProperty({ example: 'homework_id_here', description: 'Homework ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Homework' })
  homeworkId: string;

  @ApiProperty({ example: 'fileUrl', description: 'Key' })
  @Prop({ required: true })
  key: string;

  @ApiProperty({ example: 'https://example.com/file.pdf', description: 'Value' })
  @Prop({ required: true })
  value: string;
}

export const HomeworkDataSchema = SchemaFactory.createForClass(HomeworkData);
