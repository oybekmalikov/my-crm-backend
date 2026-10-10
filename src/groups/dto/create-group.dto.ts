import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'G-1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'course_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;

  @ApiProperty({ example: 'branch_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  branchId: string;

  @ApiProperty({ example: 'room_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  roomId: string;

  @ApiProperty({ example: '2025-01-01', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ example: '2025-07-01', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiProperty({ example: '16:00' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: '18:00' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ example: 'new' })
  @IsOptional()
  @IsString()
  @IsEnum(['new', 'active', 'completed'])
  status?: string;
}
