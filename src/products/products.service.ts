import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);
    return {
      message: 'PRODUCT.CREATED',
      data: product,
      success: true,
    };
  }

  async findAll(limit: number = 20, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.productModel
      .find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.productModel.countDocuments();

    return {
      message: 'PRODUCT.LIST',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('PRODUCT.NOT_FOUND');
    }
    return {
      message: 'PRODUCT.FOUND',
      data: product,
      success: true,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException('PRODUCT.NOT_FOUND');
    }
    return {
      message: 'PRODUCT.UPDATED',
      data: product,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('PRODUCT.NOT_FOUND');
    }
    return {
      message: 'PRODUCT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
