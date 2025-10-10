import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { StaffsController } from './staffs.controller';
import { StaffsService } from './staffs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff])],
  controllers: [StaffsController],
  providers: [StaffsService],
})
export class StaffsModule {}
