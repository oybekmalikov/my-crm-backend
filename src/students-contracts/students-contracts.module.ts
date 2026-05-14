import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentsContractsService } from './students-contracts.service';
import { StudentsContractsController } from './students-contracts.controller';
import { StudentsContract, StudentsContractSchema } from './entities/students-contract.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: StudentsContract.name, schema: StudentsContractSchema }]),
  ],
  controllers: [StudentsContractsController],
  providers: [StudentsContractsService],
})
export class StudentsContractsModule {}
