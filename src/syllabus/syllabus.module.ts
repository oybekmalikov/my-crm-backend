import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyllabusService } from './syllabus.service';
import { SyllabusController } from './syllabus.controller';
import { Syllabus, SyllabusSchema } from './entities/syllabus.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Syllabus.name, schema: SyllabusSchema }]),
  ],
  controllers: [SyllabusController],
  providers: [SyllabusService],
  exports: [SyllabusService],
})
export class SyllabusModule {}
