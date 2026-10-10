import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, IsMongoId } from 'class-validator';

export class CreateSyllabusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lessons?: string[];
}

export class UpdateSyllabusDto extends PartialType(CreateSyllabusDto) {}
