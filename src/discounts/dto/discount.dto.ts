import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum, IsBoolean, IsDateString } from 'class-validator';

export class CreateDiscountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsEnum(['percentage', 'amount'])
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @IsEnum(['promo', 'referral', 'staff', 'other'])
  @IsOptional()
  category?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
