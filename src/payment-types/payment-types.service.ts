import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentType, PaymentTypeDocument } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypesService {
  constructor(
    @InjectModel(PaymentType.name) private paymentTypeModel: Model<PaymentTypeDocument>,
  ) {}

  async create(createPaymentTypeDto: CreatePaymentTypeDto) {
    const record = await this.paymentTypeModel.create(createPaymentTypeDto);
    return {
      message: 'PAYMENT_TYPE.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.paymentTypeModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.paymentTypeModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'PAYMENT_TYPE.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'PAYMENT_TYPE.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.paymentTypeModel.findById(id).exec();
    if (!record) {
      throw new NotFoundException('PAYMENT_TYPE.NOT_FOUND');
    }
    return {
      message: 'PAYMENT_TYPE.FOUND',
      data: record,
      success: true,
    };
  }

  async update(id: string, updatePaymentTypeDto: UpdatePaymentTypeDto) {
    const record = await this.paymentTypeModel
      .findByIdAndUpdate(id, updatePaymentTypeDto, { new: true })
      .exec();
    if (!record) {
      throw new NotFoundException('PAYMENT_TYPE.NOT_FOUND');
    }
    return {
      message: 'PAYMENT_TYPE.UPDATED',
      data: record,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.paymentTypeModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('PAYMENT_TYPE.NOT_FOUND');
    }
    return {
      message: 'PAYMENT_TYPE.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
