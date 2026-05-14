import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidationArguments,
} from 'class-validator';
import { RolesType } from '../../@types';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali', description: "This is the user's first name" })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'USER.FIRST_NAME_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'USER.FIRST_NAME_MUST_BE_TEXT',
      }),
  })
  @MinLength(2, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        message: 'USER.FIRST_NAME_MIN_LENGTH',
      }),
  })
  @MaxLength(30, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        message: 'USER.FIRST_NAME_MAX_LENGTH',
      }),
  })
  firstName: string;

  @ApiProperty({
    example: 'Aliyev',
    description: "This is the user's last name",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'USER.LAST_NAME_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'USER.LAST_NAME_MUST_BE_TEXT',
      }),
  })
  @MinLength(2, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        message: 'USER.LAST_NAME_MIN_LENGTH',
      }),
  })
  @MaxLength(30, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        message: 'USER.LAST_NAME_MAX_LENGTH',
      }),
  })
  lastName: string;

  @ApiProperty({
    example: 'Aliyevich',
    description: "This is the user's middle name",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'USER.MIDDLE_NAME_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'USER.MIDDLE_NAME_MUST_BE_TEXT',
      }),
  })
  @MinLength(2, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        message: 'USER.MIDDLE_NAME_MIN_LENGTH',
      }),
  })
  @MaxLength(30, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        message: 'USER.MIDDLE_NAME_MAX_LENGTH',
      }),
  })
  middleName: string;

  @ApiProperty({
    example: 'ali-aliyev',
    description: "This user's login name",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'USER.LOGIN_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'USER.LOGIN_MUST_BE_TEXT',
      }),
  })
  login: string;

  @ApiProperty({
    example: 'example1234!',
    description: "This user's password",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'USER.PASSWORD_REQUIRED',
      }),
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: () =>
        JSON.stringify({
          message: 'USER.PASSWORD_NOT_STRONG',
        }),
    },
  )
  password: string;

  @ApiProperty({
    example: '+998901234567',
    description: "This user's phone number",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'USER.PHONE_REQUIRED',
      }),
  })
  @IsPhoneNumber('UZ', {
    message: () =>
      JSON.stringify({
        message: 'USER.PHONE_NOT_VALID',
      }),
  })
  phone: string;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: "This user's avatar url",
  })
  @IsOptional()
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'USER.AVATAR_URL_MUST_BE_TEXT',
      }),
  })
  avatarUrl?: string;

  @ApiProperty({
    example: 'USER',
    description: "This user's role",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'USER.ROLE_MUST_BE_TEXT',
      }),
  })
  @IsEnum(['SUPERADMIN', 'ADMIN', 'STUDENT', 'TEACHER', 'STAFF'], {
    message: () => JSON.stringify({ message: 'USER.ROLE_MUST_BE_VALID_ENUM' }),
  })
  role: RolesType;
}
