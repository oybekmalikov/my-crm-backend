import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWorkerPaymentDto } from './dto/create-worker-payment.dto';
import { UpdateWorkerPaymentDto } from './dto/update-worker-payment.dto';
import { WorkerPayment, WorkerPaymentDocument } from './entities/worker-payment.entity';

@Injectable()
export class WorkerPaymentsService {
  constructor(
    @InjectModel(WorkerPayment.name) private workerPaymentModel: Model<WorkerPaymentDocument>,
  ) {}

  async create(createWorkerPaymentDto: CreateWorkerPaymentDto) {
    const record = await this.workerPaymentModel.create(createWorkerPaymentDto);
    return {
      message: 'WORKER_PAYMENT.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.workerPaymentModel
      .find({ isDeleted: false })
      .populate('workerContractId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.workerPaymentModel.countDocuments({ isDeleted: false });

    if (data.length === 0) {
      return {
        message: 'WORKER_PAYMENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'WORKER_PAYMENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.workerPaymentModel
      .findOne({ _id: id, isDeleted: false })
      .populate('workerContractId')
      .exec();
    if (!record) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'WORKER_PAYMENT.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updateWorkerPaymentDto: UpdateWorkerPaymentDto) {
    const record = await this.workerPaymentModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateWorkerPaymentDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'WORKER_PAYMENT.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.workerPaymentModel
      .findByIdAndUpdate(id, { isDeleted: true, status: 'refunded' }, { new: true })
      .exec();
    if (!deleted) {
      throw new NotFoundException('WORKER_PAYMENT.NOT_FOUND');
    }
    return {
      message: 'WORKER_PAYMENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
