import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/entities/product.entity';
import { Student, StudentDocument } from '../students/entities/student.entity';
import { CreateStudentsProductDto } from './dto/create-students-product.dto';
import { UpdateStudentsProductDto } from './dto/update-students-product.dto';
import {
  StudentsProduct,
  StudentsProductDocument,
} from './entities/students-product.entity';

@Injectable()
export class StudentsProductsService {
  constructor(
    @InjectModel(StudentsProduct.name)
    private studentsProductModel: Model<StudentsProductDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createStudentsProductDto: CreateStudentsProductDto) {
    const quantity = createStudentsProductDto.quantity ?? 1;
    const paymentMethod = createStudentsProductDto.paymentMethod ?? 'cash';

    const [student, product] = await Promise.all([
      this.studentModel.findById(createStudentsProductDto.studentId).exec(),
      this.productModel.findById(createStudentsProductDto.productId).exec(),
    ]);

    if (!student) throw new NotFoundException('STUDENT.NOT_FOUND');
    if (!product) throw new NotFoundException('PRODUCT.NOT_FOUND');
    if (!product.isActive) throw new BadRequestException('PRODUCT.NOT_ACTIVE');
    if (product.stock < quantity) throw new BadRequestException('PRODUCT.NOT_ENOUGH_STOCK');

    let totalAmount = 0;
    let spentPoint = 0;

    if (paymentMethod === 'xp') {
      spentPoint = (product.xpPrice ?? 0) * quantity;
      if (spentPoint <= 0) throw new BadRequestException('PRODUCT.XP_PRICE_NOT_SET');
      if (student.point < spentPoint) throw new BadRequestException('STUDENT.NOT_ENOUGH_POINT');

      student.point -= spentPoint;
      student.xpLogs = [
        ...(student.xpLogs ?? []),
        { source: `store_purchase:${product.name}`, amount: -spentPoint, type: 'point', createdAt: new Date() },
      ];
      await student.save();
    } else {
      totalAmount = (product.price ?? 0) * quantity;
      if (totalAmount <= 0) throw new BadRequestException('PRODUCT.PRICE_NOT_SET');
    }

    product.stock -= quantity;
    await product.save();

    const purchase = await this.studentsProductModel.create({
      studentId: createStudentsProductDto.studentId,
      productId: createStudentsProductDto.productId,
      quantity,
      paymentMethod,
      totalAmount,
      spentPoint,
      status: createStudentsProductDto.status ?? 'completed',
    });

    return {
      message: 'STUDENTS_PRODUCT.CREATED',
      data: purchase,
      success: true,
    };
  }

  async findAll(limit: number = 20, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.studentsProductModel
      .find()
      .populate('studentId')
      .populate('productId')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.studentsProductModel.countDocuments();

    return {
      message: 'STUDENTS_PRODUCT.LIST',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const purchase = await this.studentsProductModel
      .findById(id)
      .populate('studentId')
      .populate('productId')
      .exec();
    if (!purchase) {
      throw new NotFoundException('STUDENTS_PRODUCT.NOT_FOUND');
    }

    return {
      message: 'STUDENTS_PRODUCT.FOUND',
      data: purchase,
      success: true,
    };
  }

  async update(id: string, updateStudentsProductDto: UpdateStudentsProductDto) {
    const purchase = await this.studentsProductModel
      .findByIdAndUpdate(id, updateStudentsProductDto, { new: true })
      .exec();
    if (!purchase) {
      throw new NotFoundException('STUDENTS_PRODUCT.NOT_FOUND');
    }

    return {
      message: 'STUDENTS_PRODUCT.UPDATED',
      data: purchase,
      success: true,
    };
  }

  async remove(id: string) {
    const purchase = await this.studentsProductModel.findByIdAndDelete(id).exec();
    if (!purchase) {
      throw new NotFoundException('STUDENTS_PRODUCT.NOT_FOUND');
    }

    return {
      message: 'STUDENTS_PRODUCT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
