import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';
import { Discount, DiscountDocument } from './entities/discount.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectModel(Discount.name) private discountModel: Model<DiscountDocument>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto) {
    const existing = await this.discountModel.findOne({ code: createDiscountDto.code }).exec();
    if (existing) throw new BadRequestException('DISCOUNT.CODE_EXISTS');

    const discount = await this.discountModel.create(createDiscountDto);
    return {
      message: 'DISCOUNT.CREATED',
      data: discount,
      success: true,
    };
  }

  async findAll() {
    const data = await this.discountModel.find().exec();
    return {
      message: 'DISCOUNT.LIST',
      data,
      success: true,
    };
  }

  async findOne(id: string) {
    const discount = await this.discountModel.findById(id).exec();
    if (!discount) throw new NotFoundException('DISCOUNT.NOT_FOUND');
    return {
      message: 'DISCOUNT.FOUND',
      data: discount,
      success: true,
    };
  }

  async findByCode(code: string) {
    const discount = await this.discountModel.findOne({ code, isActive: true }).exec();
    if (!discount) throw new NotFoundException('DISCOUNT.INVALID_OR_INACTIVE');
    
    if (discount.expiresAt && new Date() > discount.expiresAt) {
        throw new BadRequestException('DISCOUNT.EXPIRED');
    }

    return {
      message: 'DISCOUNT.VALID',
      data: discount,
      success: true,
    };
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.discountModel.findByIdAndUpdate(id, updateDiscountDto, { new: true }).exec();
    if (!discount) throw new NotFoundException('DISCOUNT.NOT_FOUND');
    return {
      message: 'DISCOUNT.UPDATED',
      data: discount,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.discountModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('DISCOUNT.NOT_FOUND');
    return {
      message: 'DISCOUNT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
