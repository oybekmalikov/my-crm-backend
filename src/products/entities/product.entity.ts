import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @ApiProperty({ example: 'JavaScript Book', description: 'Product name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ example: 'Beginner to advanced JS handbook', description: 'Product description' })
  @Prop({ default: '' })
  description: string;

  @ApiProperty({ example: 120000, description: 'Cash price' })
  @Prop({ default: 0, min: 0 })
  price: number;

  @ApiProperty({ example: 300, description: 'XP/point price' })
  @Prop({ default: 0, min: 0 })
  xpPrice: number;

  @ApiProperty({ example: 50, description: 'Available stock' })
  @Prop({ default: 0, min: 0 })
  stock: number;

  @ApiProperty({ example: true, description: 'Is product active' })
  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
