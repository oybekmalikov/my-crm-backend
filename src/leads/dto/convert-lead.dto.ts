import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ConvertLeadDto {
  @ApiProperty({ example: 'ali-aliyev', description: 'Login for the new user account' })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_LOGIN_REQUIRED' }) })
  @IsString({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_LOGIN_MUST_BE_TEXT' }) })
  login: string;

  @ApiProperty({ example: 'Example1234!', description: 'Password for the new user account' })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_PASSWORD_REQUIRED' }) })
  @IsStrongPassword(
    { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
    { message: () => JSON.stringify({ message: 'LEAD.CONVERT_PASSWORD_NOT_STRONG' }) },
  )
  password: string;

  @ApiProperty({ example: 'Aliyevich', description: "Middle name for the student's user account" })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_MIDDLE_NAME_REQUIRED' }) })
  @IsString({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_MIDDLE_NAME_MUST_BE_TEXT' }) })
  @MinLength(2, { message: () => JSON.stringify({ message: 'LEAD.CONVERT_MIDDLE_NAME_MIN_LENGTH' }) })
  @MaxLength(30, { message: () => JSON.stringify({ message: 'LEAD.CONVERT_MIDDLE_NAME_MAX_LENGTH' }) })
  middleName: string;

  @ApiProperty({ example: '2005-05-15', description: 'Date of birth for the student record' })
  @IsDateString({}, { message: () => JSON.stringify({ message: 'LEAD.CONVERT_DATE_OF_BIRTH_MUST_BE_DATE' }) })
  dateOfBirth: string;

  @ApiProperty({ example: 'MALE', description: 'Gender for the student record', enum: ['MALE', 'FEMALE'] })
  @IsEnum(['MALE', 'FEMALE'], { message: () => JSON.stringify({ message: 'LEAD.CONVERT_GENDER_MUST_BE_VALID_ENUM' }) })
  gender: string;

  @ApiProperty({ example: 'Manhattan st-10, New York', description: 'Address for the student record' })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_ADDRESS_REQUIRED' }) })
  @IsString({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_ADDRESS_MUST_BE_TEXT' }) })
  address: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Phone number override (defaults to lead phone)' })
  @IsOptional()
  @IsPhoneNumber('UZ', { message: () => JSON.stringify({ message: 'LEAD.CONVERT_PHONE_NOT_VALID' }) })
  phone?: string;

  @ApiPropertyOptional({ example: 'ali.aliyev@example.com', description: 'Email for the new user account' })
  @IsOptional()
  @IsString({ message: () => JSON.stringify({ message: 'LEAD.CONVERT_EMAIL_MUST_BE_TEXT' }) })
  email?: string;
}
