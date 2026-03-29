import { Module } from '@nestjs/common';
import { StudentsProductsService } from './students-products.service';
import { StudentsProductsController } from './students-products.controller';

@Module({
  controllers: [StudentsProductsController],
  providers: [StudentsProductsService],
})
export class StudentsProductsModule {}
