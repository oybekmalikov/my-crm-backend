import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'The ID of the user who received the notification',
  })
  @IsMongoId({
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.USER_ID_INVALID',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.USER_ID_REQUIRED',
      }),
  })
  userId: string;

  @ApiProperty({
    example: 'New Message',
    description: 'The title of the notification',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.TITLE_MUST_BE_TEXT',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.TITLE_REQUIRED',
      }),
  })
  title: string;

  @ApiProperty({
    example: 'You have a new message from support.',
    description: 'The message content of the notification',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.MESSAGE_MUST_BE_TEXT',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.MESSAGE_REQUIRED',
      }),
  })
  message: string;

  @ApiProperty({
    example: 'info',
    description: 'The type of notification (info, warning, error, success)',
    enum: ['info', 'warning', 'error', 'success'],
  })
  @IsEnum(['info', 'warning', 'error', 'success'], {
    message: () =>
      JSON.stringify({
        message: 'NOTIFICATION.TYPE_MUST_BE_VALID_ENUM',
      }),
  })
  @IsOptional()
  type?: string;
}
