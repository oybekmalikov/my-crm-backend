import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId, IsEnum, IsOptional, IsDateString } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'course_id_here' })
  @IsOptional()
  @IsMongoId()
  courseId?: string;

  @ApiPropertyOptional({ example: 'instagram' })
  @IsOptional()
  @IsEnum(['telegram', 'instagram', 'website', 'friend', 'other'])
  source?: string;

  @ApiPropertyOptional({ example: 'new' })
  @IsOptional()
  @IsEnum(['new', 'contacted', 'trial', 'registered', 'lost'])
  status?: string;

  @ApiPropertyOptional({ example: 'Wants to study in the evening' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'staff_id_here' })
  @IsOptional()
  @IsMongoId()
  assignedTo?: string;

  @ApiPropertyOptional({ example: '2025-01-01T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  nextContactDate?: string;
}
