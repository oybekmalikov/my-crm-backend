import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLeadActivityDto {
  @ApiProperty({ example: 'call' })
  @IsEnum(['call', 'trial', 'website_visit', 'follow_up', 'message', 'note'])
  type: string;

  @ApiPropertyOptional({ example: 'answered' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  outcome?: string;

  @ApiPropertyOptional({ example: 'Spoke with parent, interested in weekend group' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({ example: 'user_id_here' })
  @IsOptional()
  @IsMongoId()
  actorUserId?: string;

  @ApiPropertyOptional({ example: '2026-07-08T11:00:00Z' })
  @IsOptional()
  @IsDateString()
  happenedAt?: string;
}
