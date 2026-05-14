import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsOptional, IsMongoId } from 'class-validator';

export class CreateGroupTeacherDto {
  @ApiProperty({ example: 'group_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  groupId: string;

  @ApiProperty({ example: 'teacher_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  teacherId: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
