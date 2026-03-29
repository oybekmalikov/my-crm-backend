import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Staff, StaffSchema } from './entities/staff.entity';
import { StaffsController } from './staffs.controller';
import { StaffsService } from './staffs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Staff.name, schema: StaffSchema }]),
  ],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
