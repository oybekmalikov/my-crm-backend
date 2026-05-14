import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateBudgetTransactionDto {
  @ApiProperty({ example: 'budget_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  budgetId: string;

  @ApiProperty({ example: 'payment_type_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  categoryId: string;

  @ApiPropertyOptional({ example: 'student_login_123' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example: 'income' })
  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  target: string;

  @ApiProperty({ example: 400000 })
  @IsNotEmpty()
  @IsNumber()
  totalSum: number;

  @ApiPropertyOptional({ example: 'Student paid monthly fee' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'staff_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  createdBy: string;

  @ApiPropertyOptional({ example: 'completed' })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed', 'refunded'])
  status?: string;
}
