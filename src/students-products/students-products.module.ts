import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '../products/entities/product.entity';
import { Student, StudentSchema } from '../students/entities/student.entity';
import { StudentsProductsService } from './students-products.service';
import { StudentsProductsController } from './students-products.controller';
import {
  StudentsProduct,
  StudentsProductSchema,
} from './entities/students-product.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentsProduct.name, schema: StudentsProductSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [StudentsProductsController],
  providers: [StudentsProductsService],
})
export class StudentsProductsModule {}
