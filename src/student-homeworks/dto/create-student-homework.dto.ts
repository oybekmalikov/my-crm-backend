import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateStudentHomeworkDto {
  @ApiProperty({ example: 'student_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @ApiProperty({ example: 'homework_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  homeworkId: string;

  @ApiProperty({ example: 'Here is my solution...' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
