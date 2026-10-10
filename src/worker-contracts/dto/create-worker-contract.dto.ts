import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateWorkerContractDto {
  @ApiProperty({ example: 'contract_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  contractId: string;

  @ApiProperty({ example: 'worker_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  workerId: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ example: 10000000 })
  @IsNotEmpty()
  @IsNumber()
  baseSalary: number;

  @ApiPropertyOptional({ example: '{"KPI": 500000}' })
  @IsOptional()
  @IsString()
  bonusStructure?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
