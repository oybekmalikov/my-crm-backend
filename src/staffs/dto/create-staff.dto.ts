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

export class CreateStaffDto {
  @ApiProperty({
    example: '60c72b2f9b1d8b001c8e4b5a',
    description: 'This is the staffs userId string.',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'userId matn bo‘lishi kerak!',
        ru: 'userId должен быть строкой!',
        en: 'userId must be a string!',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        uz: 'userId kiritilishi shart!',
        ru: 'userId обязателен!',
        en: 'userId is required!',
      }),
  })
  userId: string;

  @ApiProperty({
    example: '2005-05-15',
    description: 'This is the staffs date of birth',
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
    description: 'This is the staffs gender type',
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
    description: 'This staffs activity',
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
    example: 5000000,
    description: 'This staffs salary',
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Maosh son bo‘lishi kerak!',
          ru: 'Зарплата должен быть числом!',
          en: 'Salary must be a number!',
        }),
    },
  )
  salary: number;

  @ApiProperty({
    example: true,
    description: 'This staffs salary paid for last month or not',
  })
  salary_paid_for_last_month: boolean;

  @ApiProperty({
    example: 56,
    description: 'This staffs position',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Lavozim matn bo‘lishi kerak!',
        ru: 'Должность должна быть строкой!',
        en: 'Position must be a string!',
      }),
  })
  position: string;
}
