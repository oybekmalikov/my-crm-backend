import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LeadsQueryDto {
  @ApiProperty({ required: false, description: 'Start date (ISO string)' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'DASHBOARD.INVALID_FROM_DATE' }) })
  fromDate?: string;

  @ApiProperty({ required: false, description: 'End date (ISO string)' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'DASHBOARD.INVALID_TO_DATE' }) })
  toDate?: string;
}
