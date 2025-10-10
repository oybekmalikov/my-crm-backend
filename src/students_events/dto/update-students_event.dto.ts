import { PartialType } from '@nestjs/swagger';
import { CreateStudentsEventDto } from './create-students_event.dto';

export class UpdateStudentsEventDto extends PartialType(CreateStudentsEventDto) {}
