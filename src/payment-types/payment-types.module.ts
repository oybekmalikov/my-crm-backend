import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentTypesService } from './payment-types.service';
import { PaymentTypesController } from './payment-types.controller';
import { PaymentType, PaymentTypeSchema } from './entities/payment-type.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PaymentType.name, schema: PaymentTypeSchema }]),
  ],
  controllers: [PaymentTypesController],
  providers: [PaymentTypesService],
})
export class PaymentTypesModule {}
