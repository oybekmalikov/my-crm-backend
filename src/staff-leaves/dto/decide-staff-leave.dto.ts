import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DecideStaffLeaveDto {
  @ApiProperty({ example: 'APPROVED', description: 'Decision: APPROVED or REJECTED', enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(['APPROVED', 'REJECTED'], { message: () => JSON.stringify({ message: 'STAFF_LEAVE.STATUS_MUST_BE_VALID_ENUM' }) })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.STATUS_REQUIRED' }) })
  status: 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Approved — enjoy your vacation', description: 'Optional note from admin' })
  @IsOptional()
  @IsString({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.ADMIN_NOTE_MUST_BE_TEXT' }) })
  adminNote?: string;

  @ApiProperty({ example: '60c72b2f9b1d8b001c8e4b5a', description: 'Admin user ID making the decision' })
  @IsMongoId({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.DECIDED_BY_INVALID' }) })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'STAFF_LEAVE.DECIDED_BY_REQUIRED' }) })
  decidedBy: string;
}
