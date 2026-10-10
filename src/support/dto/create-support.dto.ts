import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSupportDto {
  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d1',
    description: 'The ID of the user who sent the support request',
  })
  @IsMongoId({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.SENDER_ID_INVALID',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.SENDER_ID_REQUIRED',
      }),
  })
  senderId: string;

  @ApiProperty({
    example: '64f1a2b3c4d5e6f7a8b9c0d2',
    description: 'The ID of the staff/admin who received the support request',
  })
  @IsMongoId({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.RECEIPT_ID_INVALID',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.RECEIPT_ID_REQUIRED',
      }),
  })
  reciptId: string;

  @ApiProperty({
    example: 'I have an issue with my payment.',
    description: 'The content of the support message',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.CONTENT_MUST_BE_TEXT',
      }),
  })
  @IsNotEmpty({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.CONTENT_REQUIRED',
      }),
  })
  @MinLength(5, {
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.CONTENT_TOO_SHORT',
      }),
  })
  content: string;

  @ApiProperty({
    example: 'https://example.com/issue.jpg',
    description: 'Optional image URL for the support request',
  })
  @IsString({
    message: () =>
      JSON.stringify({
        message: 'SUPPORT.IMAGE_URL_MUST_BE_TEXT',
      }),
  })
  @IsOptional()
  imageUrl?: string;
}
