import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam, ExamSchema } from './entities/exam.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
