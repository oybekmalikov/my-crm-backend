import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateParentDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Valiyev' })
  @IsString()
  lastName: string;

  @ApiPropertyOptional({ example: 'Aliyevich' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ example: 'parent-ali' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  password: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ example: 'ali.parent@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ example: ['student_id_here'] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  studentIds?: string[];
}
