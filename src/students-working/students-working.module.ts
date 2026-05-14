import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsWorkingService } from './students-working.service';
import { StudentsWorkingController } from './students-working.controller';
import { StudentWorking, StudentWorkingSchema } from './entities/student-working.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentWorking.name, schema: StudentWorkingSchema }]),
  ],
  controllers: [StudentsWorkingController],
  providers: [StudentsWorkingService],
})
export class StudentsWorkingModule {}
