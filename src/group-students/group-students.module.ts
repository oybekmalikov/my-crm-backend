import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupStudentsService } from './group-students.service';
import { GroupStudentsController } from './group-students.controller';
import { GroupStudent, GroupStudentSchema } from './entities/group-student.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroupStudent.name, schema: GroupStudentSchema }]),
  ],
  controllers: [GroupStudentsController],
  providers: [GroupStudentsService],
})
export class GroupStudentsModule {}
