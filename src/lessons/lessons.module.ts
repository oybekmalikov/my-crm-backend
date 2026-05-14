import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { Lesson, LessonSchema } from './entities/lesson.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
