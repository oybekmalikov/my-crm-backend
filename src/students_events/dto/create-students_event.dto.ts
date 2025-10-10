import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateStudentsEventDto {
  @ApiProperty({
    example: 1,
    description: "This is the student's ID number",
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'studentId son bo‘lishi kerak!',
          ru: 'studentId должен быть числом!',
          en: 'studentId must be a number!',
        }),
    },
  )
  studentId: number;

  @ApiProperty({
    example: 1,
    description: "This is the event's ID number",
  })
  @IsNumber(
    {},
    {
      message: () =>
        JSON.stringify({
          uz: 'eventId son bo‘lishi kerak!',
          ru: 'eventId должен быть числом!',
          en: 'eventId must be a number!',
        }),
    },
  )
  eventId: number;

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
