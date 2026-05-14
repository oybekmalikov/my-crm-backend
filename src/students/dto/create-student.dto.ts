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
    example: '60c72b2f9b1d8b001c8e4b5a',
    description: 'This is the students userId string.',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'STUDENT.USER_ID_MUST_BE_TEXT',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'STUDENT.USER_ID_REQUIRED',
      }),
  })
  userId: string;

  @ApiProperty({
    example: '2005-05-15',
    description: 'This is the students date of birth',
  })
  @IsDateString(
    {},
    {
      message: () =>
        JSON.stringify({
          message: 'STUDENT.DATE_OF_BIRTH_MUST_BE_DATE',
        }),
    },
  )
  dateOfBirth: string;

  @ApiProperty({
    example: 'MALE',
    description: 'This is the students gender type',
  })
  @IsEnum(['MALE', 'FEMALE'], {
    message: () =>
      JSON.stringify({
        message: 'STUDENT.GENDER_MUST_BE_VALID_ENUM',
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
        message: 'STUDENT.ADDRESS_MUST_BE_TEXT',
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
        message: 'STUDENT.IS_ACTIVE_MUST_BE_BOOLEAN',
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
          message: 'STUDENT.XP_MUST_BE_NUMBER',
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
          message: 'STUDENT.POINT_MUST_BE_NUMBER',
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
          message: 'STUDENT.AVERAGE_MARK_MUST_BE_NUMBER',
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
          message: 'STUDENT.LEVEL_MUST_BE_NUMBER',
        }),
    },
  )
  level: number;
}
