import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({ example: 2025 })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 15000000 })
  @IsOptional()
  @IsNumber()
  totalIncome?: number;

  @ApiProperty({ example: 10000000 })
  @IsOptional()
  @IsNumber()
  totalExpense?: number;

  @ApiProperty({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  netBalance?: number;

  @ApiPropertyOptional({ example: 'January 2025 Budget Report' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'staff_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  createdBy: string;
}
