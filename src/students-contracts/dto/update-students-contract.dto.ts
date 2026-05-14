import { PartialType } from '@nestjs/swagger';
import { CreateStudentsContractDto } from './create-students-contract.dto';

export class UpdateStudentsContractDto extends PartialType(CreateStudentsContractDto) {}
