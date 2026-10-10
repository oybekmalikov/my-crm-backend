import { PartialType } from '@nestjs/swagger';
import { CreateStudentWorkingDto } from './create-student-working.dto';

export class UpdateStudentWorkingDto extends PartialType(CreateStudentWorkingDto) {}
