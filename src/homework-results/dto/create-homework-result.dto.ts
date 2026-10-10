import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsNumber, IsEnum, Min, Max } from 'class-validator';

export class CreateHomeworkResultDto {
  @ApiProperty({ example: 'student_homework_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentHomeworkId: string;

  @ApiProperty({ example: 'homework_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  homeworkId: string;

  @ApiProperty({ example: 'teacher_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  teacherId: string;

  @ApiProperty({ example: 95 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  mark: number;

  @ApiProperty({ example: 'Good job!' })
  @IsNotEmpty()
  @IsString()
  feedback: string;

  @ApiProperty({ example: 'accepted' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(['accepted', 'rejected'])
  status: string;
}
