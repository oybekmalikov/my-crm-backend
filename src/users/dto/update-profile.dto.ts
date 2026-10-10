import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Ali' })
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional({ example: 'Aliyev' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional({ example: 'Aliyevich' })
  @IsOptional()
  @IsString()
  readonly middleName?: string;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
