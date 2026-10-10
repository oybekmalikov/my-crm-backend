import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'The reset token emailed to the user' })
  @IsNotEmpty({ message: () => JSON.stringify({ message: 'TOKEN_REQUIRED' }) })
  @IsString()
  readonly token: string;

  @ApiProperty({ example: 'NewPassw0rd!' })
  @IsNotEmpty({
    message: () => JSON.stringify({ message: 'PASSWORD_REQUIRED' }),
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: () => JSON.stringify({ message: 'PASSWORD_NOT_STRONG' }),
    },
  )
  readonly newPassword: string;
}
