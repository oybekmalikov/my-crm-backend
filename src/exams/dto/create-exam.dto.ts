import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({ example: 'group_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  groupId: string;

  @ApiProperty({ example: 'task_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  taskId: string;

  @ApiProperty({ example: '2025-01-01T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  scheduled: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  deadline: string;

  @ApiProperty({ example: 'scheduled' })
  @IsOptional()
  @IsString()
  @IsEnum(['scheduled', 'progress', 'completed', 'cancelled'])
  status?: string;
}
