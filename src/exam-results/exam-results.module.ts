import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from '../students/students.module';
import { StudentHomework, StudentHomeworkSchema } from '../student-homeworks/entities/student-homework.entity';
import { ExamResultsService } from './exam-results.service';
import { ExamResultsController } from './exam-results.controller';
import { ExamResult, ExamResultSchema } from './entities/exam-result.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamResult.name, schema: ExamResultSchema },
      { name: StudentHomework.name, schema: StudentHomeworkSchema },
    ]),
    StudentsModule,
  ],
  controllers: [ExamResultsController],
  providers: [ExamResultsService],
})
export class ExamResultsModule {}
