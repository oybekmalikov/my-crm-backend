import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type BranchDocument = HydratedDocument<Branch>;

@Schema({ timestamps: true, collection: 'branches' })
export class Branch {
  @ApiProperty({ example: 'Main Branch', description: 'Branch name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: '+998901234567', description: 'Call number' })
  @Prop({ required: true })
  callNumber: string;

  @ApiProperty({ example: { lat: 41.2995, lon: 69.2401 }, description: 'Location' })
  @Prop({ type: Object, required: true })
  location: { lat: number, lon: number };
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
