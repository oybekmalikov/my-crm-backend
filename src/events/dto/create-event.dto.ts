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
        message: 'EVENT.TITLE_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'EVENT.TITLE_MUST_BE_TEXT',
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
        message: 'EVENT.DESCRIPTION_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'EVENT.DESCRIPTION_MUST_BE_TEXT',
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
        message: 'EVENT.GUEST_FULLNAME_REQUIRED',
      }),
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'EVENT.GUEST_FULLNAME_MUST_BE_TEXT',
      }),
  })
  guestFullName!: string;

  @ApiProperty({
    example: 'Ryan Dahl is the creator of Node.js',
    description: "This is the guest's description",
  })
  @IsOptional()
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'EVENT.GUEST_DESCRIPTION_MUST_BE_TEXT',
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
        message: 'EVENT.GUEST_PICTURE_URL_MUST_BE_TEXT',
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
          message: 'EVENT.TOTAL_PLACES_MUST_BE_NUMBER',
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
          message: 'EVENT.AVAILABLE_PLACES_MUST_BE_NUMBER',
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
          message: 'EVENT.DATE_MUST_BE_DATE',
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
        message: 'EVENT.TIME_MUST_BE_TEXT',
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
          message: 'EVENT.POINT_FOR_EVENT_MUST_BE_NUMBER',
        }),
    },
  )
  pointForEvent: number;

  @ApiProperty({
    example: 'SCHEDULED',
    description: "This is the event's status",
  })
  @IsEnum(['SCHEDULED', 'STARTED', 'FINIHSED', 'CANCELLED'], {
    message: () =>
      JSON.stringify({
        message: 'EVENT.STATUS_MUST_BE_VALID_ENUM',
      }),
  })
  status: string;
}
