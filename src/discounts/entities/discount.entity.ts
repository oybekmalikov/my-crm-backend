import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema({ timestamps: true, collection: 'discounts' })
export class Discount {
  @ApiProperty({ example: 'SUMMER20', description: 'Promo code or discount name' })
  @Prop({ required: true, unique: true })
  code: string;

  @ApiProperty({ example: 'percentage', description: 'Type of discount' })
  @Prop({ required: true, enum: ['percentage', 'amount'] })
  type: string;

  @ApiProperty({ example: 20, description: 'Value of discount' })
  @Prop({ required: true })
  value: number;

  @ApiProperty({ example: 'promo', description: 'Category of discount' })
  @Prop({ default: 'promo', enum: ['promo', 'referral', 'staff', 'other'] })
  category: string;

  @ApiProperty({ example: '2026-12-31', description: 'Expiration date' })
  @Prop()
  expiresAt: Date;

  @ApiProperty({ example: true, description: 'Is discount active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
