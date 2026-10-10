import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsModule } from '../notifications/notifications.module';
import { StaffsModule } from '../staffs/staffs.module';
import { StaffLeave, StaffLeaveSchema } from './entities/staff-leave.entity';
import { StaffLeavesController } from './staff-leaves.controller';
import { StaffLeavesService } from './staff-leaves.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StaffLeave.name, schema: StaffLeaveSchema }]),
    StaffsModule,
    NotificationsModule,
  ],
  controllers: [StaffLeavesController],
  providers: [StaffLeavesService],
  exports: [StaffLeavesService],
})
export class StaffLeavesModule {}
