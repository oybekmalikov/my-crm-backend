import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Lesson 1' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Introduction' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'group_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  groupId: string;

  @ApiProperty({ example: 'room_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  roomId: string;

  @ApiProperty({ example: 'scheduled' })
  @IsOptional()
  @IsString()
  @IsEnum(['scheduled', 'progress', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: 'lesson' })
  @IsOptional()
  @IsString()
  @IsEnum(['lesson', 'exam'])
  type?: string;
}
