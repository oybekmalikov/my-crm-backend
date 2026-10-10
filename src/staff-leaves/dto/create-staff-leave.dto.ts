import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStaffLeaveDto {
  @ApiProperty({ example: '60c72b2f9b1d8b001c8e4b5a', description: 'Staff ID' })
  @IsMongoId({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.STAFF_ID_INVALID' }) })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.STAFF_ID_REQUIRED' }) })
  staffId: string;

  @ApiProperty({ example: '2025-06-01', description: 'Leave start date' })
  @IsDateString({}, { message: () => JSON.stringify({ message: 'STAFF_LEAVE.START_DATE_MUST_BE_DATE' }) })
  startDate: string;

  @ApiProperty({ example: '2025-06-07', description: 'Leave end date' })
  @IsDateString({}, { message: () => JSON.stringify({ message: 'STAFF_LEAVE.END_DATE_MUST_BE_DATE' }) })
  endDate: string;

  @ApiProperty({ example: 'Annual vacation', description: 'Reason for leave' })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.REASON_REQUIRED' }) })
  @IsString({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.REASON_MUST_BE_TEXT' }) })
  reason: string;

  @ApiPropertyOptional({ example: 'Personal note', description: 'Optional additional notes' })
  @IsOptional()
  @IsString({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.ADMIN_NOTE_MUST_BE_TEXT' }) })
  adminNote?: string;
}
