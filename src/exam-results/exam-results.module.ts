import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamResultsService } from './exam-results.service';
import { ExamResultsController } from './exam-results.controller';
import { ExamResult, ExamResultSchema } from './entities/exam-result.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ExamResult.name, schema: ExamResultSchema }]),
  ],
  controllers: [ExamResultsController],
  providers: [ExamResultsService],
})
export class ExamResultsModule {}
