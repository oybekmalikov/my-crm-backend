import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateStudentsProductDto {
  @ApiProperty({ example: 'student_id_here' })
  @IsMongoId()
  studentId: string;

  @ApiProperty({ example: 'product_id_here' })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ example: 'cash' })
  @IsOptional()
  @IsEnum(['cash', 'card', 'click', 'xp'])
  paymentMethod?: string;

  @ApiPropertyOptional({ example: 'completed' })
  @IsOptional()
  @IsEnum(['completed', 'cancelled', 'refunded'])
  status?: string;
}
