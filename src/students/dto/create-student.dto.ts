import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: 1,
    description: 'This is the students userId number.',
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'userId son bo‘lishi kerak!',
          ru: 'userId должен быть числом!',
          en: 'userId must be a number!',
        }),
    },
  )
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        uz: 'userId kiritilishi shart!',
        ru: 'userId обязателен!',
        en: 'userId is required!',
      }),
  })
  userId: number;

  @ApiProperty({
    example: '2005-05-15',
    description: 'This is the students date of birth',
  })
  @IsDateString(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: "Sana to'g'ri kiritilishi shart!",
          ru: 'Дата должна быть введена правильно!',
          en: 'Date must be entered correctly!',
        }),
    },
  )
  dateOfBirth: string;

  @ApiProperty({
    example: 'male',
    description: 'This is the students gender type',
  })
  @IsEnum(['male', 'female'], {
    message: () =>
      JSON.stringify({
        uz: "Jinsi ayol yoki erkak bo'lishi kerak!",
        ru: 'Пол должен быть мужским или женским!',
        en: 'Gender must be male or female!',
      }),
  })
  gender: string;

  @ApiProperty({
    example: 'Manhattan st-10, New York',
    description: 'This students full address',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Manzil matn bo‘lishi kerak!',
        ru: 'Адрес должен быть строкой!',
        en: 'Address must be a string!',
      }),
  })
  address: string;
  @ApiProperty({
    example: true,
    description: 'This students activity',
  })
  @IsBoolean({
    message: () =>
      JSON.stringify({
        uz: 'isActive mantiqiy (boolean) bo‘lishi kerak!',
        ru: 'isActive должен быть булевым!',
        en: 'isActive must be a boolean!',
      }),
  })
  isActive: boolean;

  @ApiProperty({
    example: 568,
    description: 'This students xp value',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'XP son bo‘lishi kerak!',
          ru: 'XP должен быть числом!',
          en: 'XP must be a number!',
        }),
    },
  )
  xp: number;

  @ApiProperty({
    example: 10256,
    description: 'This students point value',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Point son bo‘lishi kerak!',
          ru: 'Point должен быть числом!',
          en: 'Point must be a number!',
        }),
    },
  )
  point: number;

  @ApiProperty({
    example: 56,
    description: 'This students avarage mark: interval 0-100',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'O‘rtacha ball son bo‘lishi kerak!',
          ru: 'Средний балл должен быть числом!',
          en: 'Avarage mark must be a number!',
        }),
    },
  )
  avarageMark: number;

  @ApiProperty({
    example: 5,
    description: 'This students study level',
  })
  @IsOptional()
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Level son bo‘lishi kerak!',
          ru: 'Level должен быть числом!',
          en: 'Level must be a number!',
        }),
    },
  )
  level: number;
}
