import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Backend Bootcamp' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Learn backend' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 6 })
  @IsNumber()
  @IsEnum([6, 8])
  duration: number;

  @ApiProperty({ example: 13 })
  @IsNumber()
  monthLessons: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  weekLessons: number;

  @ApiProperty({ example: 'all' })
  @IsEnum(['odd_days', 'even_days', 'all'])
  lessonDays: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsEnum([2, 4.5])
  durationTime: number;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  priceValue: number;

  @ApiProperty({ example: 'bootcamp-foundation' })
  @IsString()
  @IsEnum(['standart', 'bootcamp-foundation', 'bootcamp-result'])
  type: string;

  @ApiProperty({ example: 'backend' })
  @IsString()
  target: string;
}
