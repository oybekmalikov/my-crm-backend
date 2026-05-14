import { PartialType } from '@nestjs/swagger';
import { CreateWorkerContractDto } from './create-worker-contract.dto';

export class UpdateWorkerContractDto extends PartialType(CreateWorkerContractDto) {}
