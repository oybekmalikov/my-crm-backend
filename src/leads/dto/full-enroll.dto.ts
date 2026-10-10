import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FullEnrollDto {
  // ── User account fields ───────────────────────────────────────────────────
  @ApiProperty({ example: 'ali-aliyev', description: 'Login for new user account' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'Example1234!', description: 'Password for new user account' })
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
  password: string;

  @ApiProperty({ example: 'Aliyevich', description: 'Middle name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  middleName: string;

  @ApiProperty({ example: '2005-05-15', description: 'Date of birth' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: 'MALE', enum: ['MALE', 'FEMALE'] })
  @IsEnum(['MALE', 'FEMALE'])
  gender: string;

  @ApiProperty({ example: 'Toshkent, Chilonzor 5', description: 'Address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsPhoneNumber('UZ')
  phone?: string;

  @ApiPropertyOptional({ example: 'ali@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  // ── Contract fields ───────────────────────────────────────────────────────
  @ApiProperty({ example: 'contract_template_id', description: 'Contract template ID' })
  @IsNotEmpty()
  @IsMongoId()
  contractId: string;

  @ApiProperty({ example: 'course_id', description: 'Course ID' })
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'half', 'full'] })
  @IsEnum(['monthly', 'half', 'full'])
  selectedPlan: string;

  @ApiPropertyOptional({
    example: 'course_plan_id',
    description: 'CoursePlan ID — pricing will be taken from it automatically',
  })
  @IsOptional()
  @IsMongoId()
  coursePlanId?: string;

  @ApiPropertyOptional({ example: 200000, description: 'Custom price override (flat total)' })
  @IsOptional()
  @IsNumber()
  customDiscount?: number;

  // ── Group enrollment (multi-course #35) ───────────────────────────────────
  @ApiProperty({
    example: ['group_id_1', 'group_id_2'],
    description: 'One or more group IDs to enroll the student into (#35 multi-course)',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  groupIds: string[];
}
