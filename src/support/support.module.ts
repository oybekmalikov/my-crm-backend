import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Support, SupportSchema } from './entities/support.entity';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Support.name, schema: SupportSchema }]),
  ],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
