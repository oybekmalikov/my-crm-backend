import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'The way to learn programming',
    description: "This is the event's title",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        uz: 'Title kiritilishi shart!',
        ru: 'Название обязательно!',
        en: 'Title is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Title matn bo‘lishi kerak!',
        ru: 'Название должно быть строкой!',
        en: 'Title must be a string!',
      }),
  })
  title: string;

  @ApiProperty({
    example: 'At this event you will learn ways to learn programming.',
    description: "This is the event's description",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        uz: 'Description kiritilishi shart!',
        ru: 'Описание обязательно!',
        en: 'Description is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Description matn bo‘lishi kerak!',
        ru: 'Описание должно быть строкой!',
        en: 'Description must be a string!',
      }),
  })
  description: string;

  @ApiProperty({
    example: 'Ryan Dahl',
    description: "This is the guest's full name",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        uz: "Mehmonni to'liq ismi kiritilishi shart!",
        ru: 'Полное имя гостя обязательно!',
        en: 'Guest full name is required!',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Mehmonni to`liq ismi matn bo‘lishi kerak!',
        ru: 'Полное имя гостя должно быть строкой!',
        en: 'Guest full name must be a string!',
      }),
  })
  guestFullName: string;

  @ApiProperty({
    example: 'Ryan Dahl is the creator of Node.js',
    description: "This is the guest's description",
  })
  @IsOptional()
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Mehmon haqida tavsif matn bo‘lishi kerak!',
        ru: 'Описание гостя должно быть строкой!',
        en: 'Guest description must be a string!',
      }),
  })
  guestDescription: string;

  @ApiProperty({
    example: 'https://example.com/guest-picture.jpg',
    description: "This is the guest's picture URL",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Mehmon rasmini URLi matn bo‘lishi kerak!',
        ru: 'URL картинки гостя должно быть строкой!',
        en: 'Guest picture URL must be a string!',
      }),
  })
  guestPictureUrl: string;

  @ApiProperty({
    example: 300,
    description: 'This is the number of total places for the event',
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Umumiy joylar soni bo‘lishi kerak!',
          ru: 'Общее количество мест должно быть числом!',
          en: 'The number of total places must be a number!',
        }),
    },
  )
  totalPlaces: number;

  @ApiProperty({
    example: 150,
    description: 'This is the number of available places for the event',
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Umumiy joylar soni bo‘lishi kerak!',
          ru: 'Общее количество мест должно быть числом!',
          en: 'The number of total places must be a number!',
        }),
    },
  )
  availablePlaces: string;

  @ApiProperty({
    example: '10-10-2025',
    description: "This is the event's date",
  })
  @IsDateString(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Sana bo‘lishi kerak!',
          ru: 'Дата должна быть датой!',
          en: 'Date must be a date!',
        }),
    },
  )
  date: string;
  @ApiProperty({
    example: '18:00',
    description: "This is the event's time",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'Vaqt matn bo‘lishi kerak!',
        ru: 'Время должно быть строкой!',
        en: 'Time must be a string!',
      }),
  })
  time: string;

  @ApiProperty({
    example: 50,
    description: "This is the event's point for event",
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'Narx bo‘lishi kerak!',
          ru: 'Цена должна быть числом!',
          en: 'Price must be a number!',
        }),
    },
  )
  pointForEvent: number;

  @ApiProperty({
    example: 'Scheduled',
    description: "This is the event's status",
  })
  @IsEnum(['Scheduled', 'Started', 'Finished', 'Canceled'], {
    message: () =>
      JSON.stringify({
        uz: 'Status Scheduled, Started, Finished yoki Canceled bo‘lishi kerak!',
        ru: 'Статус должен быть Scheduled, Started, Finished или Canceled!',
        en: 'Status must be Scheduled, Started, Finished or Canceled!',
      }),
  })
  status: string;
}
