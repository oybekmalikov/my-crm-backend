import { PartialType } from '@nestjs/swagger';
import { CreateStudentHomeworkDataDto } from './create-student-homework-data.dto';

export class UpdateStudentHomeworkDataDto extends PartialType(CreateStudentHomeworkDataDto) {}
