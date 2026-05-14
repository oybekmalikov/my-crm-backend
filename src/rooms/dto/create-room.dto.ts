import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room 101' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'branch_id_here' })
  @IsNotEmpty()
  @IsMongoId()
  branchId: string;

  @ApiProperty({ example: 20 })
  @IsOptional()
  @IsNumber()
  capacity?: number;
}
