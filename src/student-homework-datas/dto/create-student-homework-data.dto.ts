import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateStudentHomeworkDataDto {
  @ApiProperty({ example: 'student_homework_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentHomeworkId: string;

  @ApiProperty({ example: 'fileUrl' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ example: 'https://example.com/solution.pdf' })
  @IsNotEmpty()
  @IsString()
  value: string;
}
