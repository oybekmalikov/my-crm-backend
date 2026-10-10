import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsDateString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateStudentWorkingDto {
  @ApiProperty({ example: 'completed_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  completedId: string;

  @ApiProperty({ example: 'Google' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: '2025-01-01T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isWorking: boolean;

  @ApiProperty({ example: 'Backend Developer' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @IsNumber()
  salary: number;
}
