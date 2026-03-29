import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsModule } from '../students/students.module';
import {
  StudentsEvent,
  StudentsEventSchema,
} from './entities/students_event.entity';
import { StudentsEventsController } from './students_events.controller';
import { StudentsEventsService } from './students_events.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentsEvent.name, schema: StudentsEventSchema },
    ]),
    StudentsModule,
  ],
  controllers: [StudentsEventsController],
  providers: [StudentsEventsService],
})
export class StudentsEventsModule {}
