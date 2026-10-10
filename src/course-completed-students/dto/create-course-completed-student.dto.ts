import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';

export class CreateCourseCompletedStudentDto {
  @ApiProperty({ example: 'student_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @ApiProperty({ example: 'group_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  completedGroupId: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  completedTime: string;
}
