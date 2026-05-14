import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema({ timestamps: true, collection: 'rooms' })
export class Room {
  @ApiProperty({ example: 'Room 101', description: 'Room name' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'branch_id_here', description: 'Branch ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Branch' })
  branchId: string;

  @ApiProperty({ example: 20, description: 'Capacity' })
  @Prop({ required: true, default: 20 })
  capacity: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
