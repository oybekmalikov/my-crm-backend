import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateStudentsEventDto {
  @ApiProperty({
    example: '60c72b2f9b1d8b001c8e4b5a',
    description: "This is the student's ID string",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'STUDENT_EVENT.STUDENT_ID_MUST_BE_TEXT',
      }),
  })
  studentId: string;

  @ApiProperty({
    example: '60c72b2f9b1d8b001c8e4b5b',
    description: "This is the event's ID string",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'STUDENT_EVENT.EVENT_ID_MUST_BE_TEXT',
      }),
  })
  eventId: string;

  @ApiProperty({
    example: true,
    description: "This is the student's attendance status",
  })
  @IsBoolean({
    message: () =>
      JSON.stringify({
        message: 'STUDENT_EVENT.IS_ATTENDED_MUST_BE_BOOLEAN',
      }),
  })
  isAttended: boolean;
  @ApiProperty({
    example: true,
    description: "This is the point given for student's attandance ",
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          message: 'STUDENT_EVENT.GIVEN_POINT_MUST_BE_NUMBER',
        }),
    },
  )
  givenPointForEvent: number;
  @ApiProperty({
    example: true,
    description: "This is the student's attendance status",
  })
  @IsEnum(['SCHEDULED', 'SCHEDULED'], {
    message: () =>
      JSON.stringify({
        message: 'STUDENT_EVENT.STATUS_MUST_BE_VALID_ENUM',
      }),
  })
  status: string;
}
