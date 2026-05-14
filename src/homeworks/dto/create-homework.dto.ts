import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsDateString } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty({ example: 'lesson_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  lessonId: string;

  @ApiProperty({ example: 'teacher_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  teacherId: string;

  @ApiProperty({ example: 'Complete exercises 1 to 5' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  deadline: string;
}
