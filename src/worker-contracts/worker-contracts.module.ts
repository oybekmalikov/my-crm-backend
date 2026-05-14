import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerContractsService } from './worker-contracts.service';
import { WorkerContractsController } from './worker-contracts.controller';
import { WorkerContract, WorkerContractSchema } from './entities/worker-contract.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WorkerContract.name, schema: WorkerContractSchema }]),
  ],
  controllers: [WorkerContractsController],
  providers: [WorkerContractsService],
})
export class WorkerContractsModule {}
