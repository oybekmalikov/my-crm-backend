import { PartialType } from '@nestjs/swagger';
import { CreateLessonDataDto } from './create-lesson-data.dto';

export class UpdateLessonDataDto extends PartialType(CreateLessonDataDto) {}
