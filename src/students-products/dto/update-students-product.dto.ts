import { PartialType } from '@nestjs/swagger';
import { CreateStudentsProductDto } from './create-students-product.dto';

export class UpdateStudentsProductDto extends PartialType(CreateStudentsProductDto) {}
