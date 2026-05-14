import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeworkResultsService } from './homework-results.service';
import { HomeworkResultsController } from './homework-results.controller';
import { HomeworkResult, HomeworkResultSchema } from './entities/homework-result.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HomeworkResult.name, schema: HomeworkResultSchema }]),
  ],
  controllers: [HomeworkResultsController],
  providers: [HomeworkResultsService],
})
export class HomeworkResultsModule {}
