import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class CreateStudentsEventDto {
  @ApiProperty({
    example: '60c72b2f9b1d8b001c8e4b5a',
    description: "This is the student's ID string",
  })
  @IsString({
    message: () =>
      JSON.stringify({
        uz: 'studentId matn bo‘lishi kerak!',
        ru: 'studentId должен быть строкой!',
        en: 'studentId must be a string!',
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
        uz: 'eventId matn bo‘lishi kerak!',
        ru: 'eventId должен быть строкой!',
        en: 'eventId must be a string!',
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
        uz: 'isAttended boolean bo‘lishi kerak!',
        ru: 'isAttended должен быть boolean!',
        en: 'isAttended must be a boolean!',
      }),
  })
  isAttended: boolean;
}
