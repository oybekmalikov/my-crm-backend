import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AttendanceQueryDto {
  @ApiProperty({ required: false, description: 'Group ID to filter attendance' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'DASHBOARD.INVALID_GROUP_ID' }) })
  groupId?: string;

  @ApiProperty({ required: false, description: 'Start date (ISO string) for date range' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'DASHBOARD.INVALID_FROM_DATE' }) })
  fromDate?: string;

  @ApiProperty({ required: false, description: 'End date (ISO string) for date range' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'DASHBOARD.INVALID_TO_DATE' }) })
  toDate?: string;
}
