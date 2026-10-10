import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreatePaymentTypeDto {
  @ApiProperty({ example: 'Student Course Fee' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'income' })
  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type: string;

  @ApiPropertyOptional({ example: 'Main income category for students' })
  @IsOptional()
  @IsString()
  description?: string;
}
