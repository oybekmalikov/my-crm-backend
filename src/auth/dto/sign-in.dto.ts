import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'ali-aliyev',
    description: "This user's login name",
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'LOGIN_REQUIRED',
      }),
  })
  @IsString({
    message: () => JSON.stringify({ message: 'LOGIN_MUST_TEXT' }),
  })
  readonly login: string;

  @ApiProperty({
    example: 'example1234',
    description: "This user's password",
  })
  @IsNotEmpty({
    message: () => JSON.stringify({ message: 'PASSWORD_REQUIRED' }),
  })
  readonly password: string;
}
