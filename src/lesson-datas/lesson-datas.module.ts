import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonDatasService } from './lesson-datas.service';
import { LessonDatasController } from './lesson-datas.controller';
import { LessonData, LessonDataSchema } from './entities/lesson-data.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonData.name, schema: LessonDataSchema }]),
  ],
  controllers: [LessonDatasController],
  providers: [LessonDatasService],
})
export class LessonDatasModule {}
