import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignInDto {
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
  readonly login: string;

  @ApiProperty({
    example: 'example1234',
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
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  readonly password: string;
}
