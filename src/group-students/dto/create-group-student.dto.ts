import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateGroupStudentDto {
  @ApiProperty({ example: 'group_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  groupId: string;

  @ApiProperty({ example: 'student_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @ApiProperty({ example: 'studying' })
  @IsOptional()
  @IsString()
  @IsEnum(['studying', 'completed', 'excluded'])
  status?: string;
}
