import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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
        message: 'STAFF.USER_ID_MUST_BE_TEXT',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'STAFF.USER_ID_REQUIRED',
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
          message: 'STAFF.DATE_OF_BIRTH_MUST_BE_DATE',
        }),
    },
  )
  dateOfBirth: string;

  @ApiProperty({
    example: 'MALE',
    description: 'This is the staffs gender type',
  })
  @IsEnum(['MALE', 'FEMALE'], {
    message: () =>
      JSON.stringify({
        message: 'STAFF.GENDER_MUST_BE_VALID_ENUM',
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
        message: 'STAFF.ADDRESS_MUST_BE_TEXT',
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
        message: 'STAFF.IS_ACTIVE_MUST_BE_BOOLEAN',
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
          message: 'STAFF.SALARY_MUST_BE_NUMBER',
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
        message: 'STAFF.POSITION_MUST_BE_TEXT',
      }),
  })
  position: string;
}
