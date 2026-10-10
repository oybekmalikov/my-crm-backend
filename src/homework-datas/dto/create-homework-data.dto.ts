import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateHomeworkDataDto {
  @ApiProperty({ example: 'homework_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  homeworkId: string;

  @ApiProperty({ example: 'fileUrl' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ example: 'https://example.com/file.pdf' })
  @IsNotEmpty()
  @IsString()
  value: string;
}
