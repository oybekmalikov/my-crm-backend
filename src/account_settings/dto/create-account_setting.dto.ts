import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountSettingDto {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'The ID of the user these settings belong to',
  })
  @IsMongoId({
    message: () =>
      JSON.stringify({
        message: 'ACCOUNT_SETTING.USER_ID_INVALID',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'ACCOUNT_SETTING.USER_ID_REQUIRED',
      }),
  })
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Whether notifications are enabled for this account',
  })
  @IsBoolean({
    message: () =>
      JSON.stringify({
        message: 'ACCOUNT_SETTING.NOTIFICATION_ENABLED_MUST_BE_BOOLEAN',
      }),
  })
  @IsOptional()
  notificationEnabled?: boolean;

  @ApiProperty({
    example: 'light',
    description: 'Preferred theme for the application',
    enum: ['light', 'dark'],
  })
  @IsEnum(['light', 'dark'], {
    message: () =>
      JSON.stringify({
        message: 'ACCOUNT_SETTING.THEME_MUST_BE_VALID_ENUM',
      }),
  })
  @IsOptional()
  theme?: string;

  @ApiProperty({
    example: 'uz',
    description: 'Preferred language for the application',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'ACCOUNT_SETTING.LANGUAGE_MUST_BE_TEXT',
      }),
  })
  @IsOptional()
  language?: string;
}
