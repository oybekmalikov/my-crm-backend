import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateCoursePlanDto {
  @ApiProperty({ example: 'Standard Backend Plan' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 2000000 })
  @IsNotEmpty()
  @IsNumber()
  basePrice: number;

  @ApiProperty({ example: 400000 })
  @IsNotEmpty()
  @IsNumber()
  monthlyPrice: number;

  @ApiProperty({ example: 1100000 })
  @IsNotEmpty()
  @IsNumber()
  halfCoursePrice: number;

  @ApiProperty({ example: 2000000 })
  @IsNotEmpty()
  @IsNumber()
  fullCoursePrice: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
