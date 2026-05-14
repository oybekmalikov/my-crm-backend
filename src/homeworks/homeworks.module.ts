import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeworksService } from './homeworks.service';
import { HomeworksController } from './homeworks.controller';
import { Homework, HomeworkSchema } from './entities/homework.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Homework.name, schema: HomeworkSchema }]),
  ],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
