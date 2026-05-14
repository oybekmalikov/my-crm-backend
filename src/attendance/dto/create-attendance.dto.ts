import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsNumber, IsOptional, IsMongoId } from 'class-validator';

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

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNumber()
  lateMinute?: number;
}
