import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentHomeworkDatasService } from './student-homework-datas.service';
import { StudentHomeworkDatasController } from './student-homework-datas.controller';
import { StudentHomeworkData, StudentHomeworkDataSchema } from './entities/student-homework-data.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentHomeworkData.name, schema: StudentHomeworkDataSchema }]),
  ],
  controllers: [StudentHomeworkDatasController],
  providers: [StudentHomeworkDatasService],
})
export class StudentHomeworkDatasModule {}
