import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from '../students/students.module';
import { StudentsEvent } from './entities/students_event.entity';
import { StudentsEventsController } from './students_events.controller';
import { StudentsEventsService } from './students_events.service';

@Module({
  imports: [TypeOrmModule.forFeature([StudentsEvent]), StudentsModule],
  controllers: [StudentsEventsController],
  providers: [StudentsEventsService],
})
export class StudentsEventsModule {}
