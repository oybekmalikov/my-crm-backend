import { ApiProperty } from '@nestjs/swagger';
import {
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
        uz: 'Ism kiritilishi shart!',
        ru: 'Имя обязательно!',
        en: 'First name is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Ism matn bo‘lishi kerak!',
        ru: 'Имя должно быть строкой!',
        en: 'First name must be a string!',
      }),
  })
  @MinLength(2, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Ism kamida ${args.constraints[0]} belgidan iborat bo‘lishi kerak!`,
        ru: `Имя должно содержать не менее ${args.constraints[0]} символов!`,
        en: `First name must be at least ${args.constraints[0]} characters long!`,
      }),
  })
  @MaxLength(30, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Ism ${args.constraints[0]} belgidan oshmasligi kerak!`,
        ru: `Имя должно быть не более ${args.constraints[0]} символов!`,
        en: `First name must be at most ${args.constraints[0]} characters long!`,
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
        uz: 'Familiya kiritilishi shart!',
        ru: 'Фамилия обязательна!',
        en: 'Last name is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Familiya matn bo‘lishi kerak!',
        ru: 'Фамилия должна быть строкой!',
        en: 'Last name must be a string!',
      }),
  })
  @MinLength(2, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Familiya kamida ${args.constraints[0]} belgidan iborat bo‘lishi kerak!`,
        ru: `Фамилия должна содержать не менее ${args.constraints[0]} символов!`,
        en: `Last name must be at least ${args.constraints[0]} characters long!`,
      }),
  })
  @MaxLength(30, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Familiya ${args.constraints[0]} belgidan oshmasligi kerak!`,
        ru: `Фамилия должна быть не более ${args.constraints[0]} символов!`,
        en: `Last name must be at most ${args.constraints[0]} characters long!`,
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
        uz: 'Otasining ismi kiritilishi shart!',
        ru: 'Отчество обязательно!',
        en: 'Middle name is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Otasining ismi matn bo‘lishi kerak!',
        ru: 'Отчество должно быть строкой!',
        en: 'Middle name must be a string!',
      }),
  })
  @MinLength(2, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Otasining ismi kamida ${args.constraints[0]} belgidan iborat bo‘lishi kerak!`,
        ru: `Отчество должно содержать не менее ${args.constraints[0]} символов!`,
        en: `Middle name must be at least ${args.constraints[0]} characters long!`,
      }),
  })
  @MaxLength(30, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Otasining ismi ${args.constraints[0]} belgidan oshmasligi kerak!`,
        ru: `Отчество должно быть не более ${args.constraints[0]} символов!`,
        en: `Middle name must be at most ${args.constraints[0]} characters long!`,
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
        uz: 'Login kiritilishi shart!',
        ru: 'Логин обязателен!',
        en: 'Login is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Login matn bo‘lishi kerak!',
        ru: 'Логин должен быть строкой!',
        en: 'Login must be a string!',
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
        uz: 'Parol kiritilishi shart!',
        ru: 'Пароль обязателен!',
        en: 'Password is required!',
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
          uz: 'Parol yetarlicha murakkab emas!',
          ru: 'Пароль недостаточно сложный!',
          en: 'Password is not strong enough!',
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
        uz: 'Telefon raqami kiritilishi shart!',
        ru: 'Номер телефона обязателен!',
        en: 'Phone number is required!',
      }),
  })
  @IsPhoneNumber('UZ', {
    message: () =>
      JSON.stringify({
        uz: 'Telefon raqami noto‘g‘ri!',
        ru: 'Номер телефона недействителен!',
        en: 'Phone number not valid!',
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
        uz: 'Avatar URL matn bo‘lishi kerak!',
        ru: 'URL аватара должен быть строкой!',
        en: 'Avatar URL must be a string!',
      }),
  })
  avatarUrl?: string;

  @ApiProperty({
    example: '1',
    description: "This user's role",
  })
  @IsOptional()
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Rol matn bo‘lishi kerak!',
        ru: 'Роль должна быть строкой!',
        en: 'Role must be a string!',
      }),
  })
  role?: RolesType;
}
