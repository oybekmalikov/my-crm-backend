import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentHomeworksService } from './student-homeworks.service';
import { StudentHomeworksController } from './student-homeworks.controller';
import { StudentHomework, StudentHomeworkSchema } from './entities/student-homework.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentHomework.name, schema: StudentHomeworkSchema }]),
  ],
  controllers: [StudentHomeworksController],
  providers: [StudentHomeworksService],
})
export class StudentHomeworksModule {}
