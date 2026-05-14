import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateExamResultDto {
  @ApiProperty({ example: 'exam_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  examId: string;

  @ApiProperty({ example: 'work_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  workId: string;

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

  @ApiProperty({ example: 'Excellent performance.' })
  @IsNotEmpty()
  @IsString()
  feedback: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isAccepted: boolean;
}
