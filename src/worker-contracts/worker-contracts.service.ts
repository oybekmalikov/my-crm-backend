import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWorkerContractDto } from './dto/create-worker-contract.dto';
import { UpdateWorkerContractDto } from './dto/update-worker-contract.dto';
import { WorkerContract, WorkerContractDocument } from './entities/worker-contract.entity';

@Injectable()
export class WorkerContractsService {
  constructor(
    @InjectModel(WorkerContract.name) private workerContractModel: Model<WorkerContractDocument>,
  ) {}

  async create(createWorkerContractDto: CreateWorkerContractDto) {
    const record = await this.workerContractModel.create(createWorkerContractDto);
    return {
      message: 'WORKER_CONTRACT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.workerContractModel
      .find()
      .populate('contractId')
      .populate('workerId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.workerContractModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'WORKER_CONTRACT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'WORKER_CONTRACT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.workerContractModel
      .findById(id)
      .populate('contractId')
      .populate('workerId')
      .exec();
    if (!record) {
      throw new NotFoundException('WORKER_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'WORKER_CONTRACT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateWorkerContractDto: UpdateWorkerContractDto) {
    const record = await this.workerContractModel
      .findByIdAndUpdate(id, updateWorkerContractDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('WORKER_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'WORKER_CONTRACT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.workerContractModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('WORKER_CONTRACT.NOT_FOUND');
    }
    return {
      message: 'WORKER_CONTRACT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
