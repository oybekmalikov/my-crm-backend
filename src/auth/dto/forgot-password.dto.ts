import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'ali-aliyev',
    description: "The user's login or email address",
  })
  @IsNotEmpty({
    message: () => JSON.stringify({ message: 'LOGIN_OR_EMAIL_REQUIRED' }),
  })
  @IsString()
  readonly loginOrEmail: string;
}
