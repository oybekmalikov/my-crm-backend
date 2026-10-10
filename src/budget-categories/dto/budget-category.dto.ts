import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsBoolean } from 'class-validator';

export class CreateBudgetCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(['income', 'expense'])
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBudgetCategoryDto extends PartialType(CreateBudgetCategoryDto) {}
