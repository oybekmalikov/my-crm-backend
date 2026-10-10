import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursePlansService } from './course-plans.service';
import { CoursePlansController } from './course-plans.controller';
import { CoursePlan, CoursePlanSchema } from './entities/course-plan.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CoursePlan.name, schema: CoursePlanSchema }]),
  ],
  controllers: [CoursePlansController],
  providers: [CoursePlansService],
})
export class CoursePlansModule {}
