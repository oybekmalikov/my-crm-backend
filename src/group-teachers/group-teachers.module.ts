import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupTeachersService } from './group-teachers.service';
import { GroupTeachersController } from './group-teachers.controller';
import { GroupTeacher, GroupTeacherSchema } from './entities/group-teacher.entity';
import { Group, GroupSchema } from '../groups/entities/group.entity';
import { Staff, StaffSchema } from '../staffs/entities/staff.entity';
import { Lesson, LessonSchema } from '../lessons/entities/lesson.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupTeacher.name, schema: GroupTeacherSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Staff.name, schema: StaffSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  controllers: [GroupTeachersController],
  providers: [GroupTeachersService],
})
export class GroupTeachersModule {}
