import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsMongoId, IsEnum, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateStudentsContractDto {
  @ApiProperty({ example: 'student_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  studentId: string;

  @ApiProperty({ example: 'contract_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  contractId: string;

  @ApiProperty({ example: 'course_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;

  @ApiProperty({ example: 'monthly' })
  @IsNotEmpty()
  @IsEnum(['monthly', 'half', 'full'])
  selectedPlan: string;

  @ApiPropertyOptional({ example: 350000 })
  @IsOptional()
  @IsNumber()
  customDiscount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
