import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryAuditLogDto {
  @ApiProperty({ required: false, description: 'Filter by userId' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'AUDIT_LOG.INVALID_USER_ID' }) })
  userId?: string;

  @ApiProperty({ required: false, description: 'Filter from date (ISO string)' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'AUDIT_LOG.INVALID_FROM_DATE' }) })
  fromDate?: string;

  @ApiProperty({ required: false, description: 'Filter to date (ISO string)' })
  @IsOptional()
  @IsString({ message: JSON.stringify({ message: 'AUDIT_LOG.INVALID_TO_DATE' }) })
  toDate?: string;

  @ApiProperty({ required: false, description: 'Page number' })
  @IsOptional()
  @IsNumberString({}, { message: JSON.stringify({ message: 'AUDIT_LOG.INVALID_PAGE' }) })
  page?: string;

  @ApiProperty({ required: false, description: 'Items per page' })
  @IsOptional()
  @IsNumberString({}, { message: JSON.stringify({ message: 'AUDIT_LOG.INVALID_LIMIT' }) })
  limit?: string;
}
