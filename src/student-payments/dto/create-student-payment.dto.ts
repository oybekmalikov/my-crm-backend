import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentPaymentDto {
  @ApiProperty({ example: 'offer_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  offerId: string;

  @ApiProperty({ example: 400000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  paymentDate: string;

  @ApiProperty({ example: 'cash' })
  @IsNotEmpty()
  @IsString()
  paymentType: string;

  @ApiPropertyOptional({ example: 'Paid for January' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: 'completed' })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed', 'refunded'])
  status?: string;
}
