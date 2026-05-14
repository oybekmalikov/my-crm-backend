import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeworkDatasService } from './homework-datas.service';
import { HomeworkDatasController } from './homework-datas.controller';
import { HomeworkData, HomeworkDataSchema } from './entities/homework-data.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HomeworkData.name, schema: HomeworkDataSchema }]),
  ],
  controllers: [HomeworkDatasController],
  providers: [HomeworkDatasService],
})
export class HomeworkDatasModule {}
