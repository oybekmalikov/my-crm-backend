import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupStudentsService } from './group-students.service';
import { GroupStudentsController } from './group-students.controller';
import { GroupStudent, GroupStudentSchema } from './entities/group-student.entity';
import { Group, GroupSchema } from '../groups/entities/group.entity';
import { Room, RoomSchema } from '../rooms/entities/room.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GroupStudent.name, schema: GroupStudentSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Room.name, schema: RoomSchema },
    ]),
  ],
  controllers: [GroupStudentsController],
  providers: [GroupStudentsService],
})
export class GroupStudentsModule {}
