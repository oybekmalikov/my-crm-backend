import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({ example: 'Standard Student Contract' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Must pay in time...' })
  @IsNotEmpty()
  @IsString()
  terms: string;

  @ApiPropertyOptional({ example: 'No special notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'student' })
  @IsNotEmpty()
  @IsEnum(['worker', 'student'])
  type: string;

  @ApiProperty({ example: '2025-01-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-01-01T00:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: '/files/contract1.pdf' })
  @IsOptional()
  @IsString()
  filePath?: string;
}
