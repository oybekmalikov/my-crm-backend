import { PartialType } from '@nestjs/swagger';
import { CreateCourseCompletedStudentDto } from './create-course-completed-student.dto';

export class UpdateCourseCompletedStudentDto extends PartialType(CreateCourseCompletedStudentDto) {}
