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

export class CreateWorkerPaymentDto {
  @ApiProperty({ example: 'worker_contract_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  workerContractId: string;

  @ApiProperty({ example: 10000000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  paymentDate: string;

  @ApiProperty({ example: 'card' })
  @IsNotEmpty()
  @IsString()
  paymentType: string;

  @ApiPropertyOptional({ example: 'January Salary' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'completed' })
  @IsOptional()
  @IsEnum(['pending', 'completed', 'failed', 'refunded'])
  status?: string;
}
