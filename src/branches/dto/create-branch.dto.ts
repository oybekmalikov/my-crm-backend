import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Main Branch' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '+998901234567' })
  @IsNotEmpty()
  @IsString()
  callNumber: string;

  @ApiProperty({ example: { lat: 41.2995, lon: 69.2401 } })
  @IsNotEmpty()
  location: { lat: number, lon: number };
}
