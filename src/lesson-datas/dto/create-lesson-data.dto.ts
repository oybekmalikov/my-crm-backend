import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateLessonDataDto {
  @ApiProperty({ example: 'lesson_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  lessonId: string;

  @ApiProperty({ example: 'homework' })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ example: 'done' })
  @IsNotEmpty()
  @IsString()
  value: string;
}
