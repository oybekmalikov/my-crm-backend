import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupTeachersService } from './group-teachers.service';
import { GroupTeachersController } from './group-teachers.controller';
import { GroupTeacher, GroupTeacherSchema } from './entities/group-teacher.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: GroupTeacher.name, schema: GroupTeacherSchema }]),
  ],
  controllers: [GroupTeachersController],
  providers: [GroupTeachersService],
})
export class GroupTeachersModule {}
