import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateAttendanceDto {
  @ApiProperty({ example: 'group_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  groupId: string;

  @ApiProperty({ example: 'student_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @ApiProperty({ example: 'lesson_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  lessonId: string;

  @ApiProperty({ example: 'present', enum: ['present', 'absent', 'pending', 'late'] })
  @IsNotEmpty()
  @IsEnum(['present', 'absent', 'pending', 'late'])
  status: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNumber()
  lateMinute?: number;
}
