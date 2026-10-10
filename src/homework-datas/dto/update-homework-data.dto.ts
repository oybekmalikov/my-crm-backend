import { PartialType } from '@nestjs/swagger';
import { CreateHomeworkDataDto } from './create-homework-data.dto';

export class UpdateHomeworkDataDto extends PartialType(CreateHomeworkDataDto) {}
