import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  MinLength,
  ValidationArguments,
} from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({ example: 1, description: 'This is the sender users ID. ' })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Notug‘ri foydalanuvchi ID!',
          ru: 'Неправильный пользователь ID!',
          en: 'Invalid user ID!',
        }),
    },
  )
  senderId: string;

  @ApiProperty({
    example: 1,
    description: 'This is the recipt users ID. ',
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Notug‘ri foydalanuvchi ID!',
          ru: 'Неправильный пользователь ID!',
          en: 'Invalid user ID!',
        }),
    },
  )
  reciptId: string;

  @ApiProperty({
    example: 'Some message',
    description: 'This is the content of the message',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: '!',
        ru: 'Отчество должно быть строкой!',
        en: 'Middle name must be a string!',
      }),
  })
  @MinLength(5, {
    message: (args: ValidationArguments) =>
      JSON.stringify({
        uz: `Content kamida ${args.constraints[0]} belgidan iborat bo‘lishi kerak!`,
        ru: `Содержание должно содержать не менее ${args.constraints[0]} символов!`,
        en: `Content must be at least ${args.constraints[0]} characters long!`,
      }),
  })
  content: string;

  @ApiProperty({
    example: '/images/example.png',
    description: "This user's image path",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: "Rasm yo'li matn bo‘lishi kerak!",
        ru: 'Путь к изображению должен быть строкой!',
        en: 'Image path must be a string!',
      }),
  })
  imageUrl: string;
}
