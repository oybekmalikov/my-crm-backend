import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomDocument } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const room = await this.roomModel.create(createRoomDto);
    return {
      message: 'ROOM.CREATED',
      data: room,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.roomModel
      .find()
      .populate('branchId')
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.roomModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'ROOM.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'ROOM.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const room = await this.roomModel.findById(id).populate('branchId').exec();
    if (!room) {
      throw new NotFoundException('ROOM.NOT_FOUND');
    }
    return {
      message: 'ROOM.FOUND',
      data: room,
      success: true,
    };
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();
    if (!room) {
      throw new NotFoundException('ROOM.NOT_FOUND');
    }
    return {
      message: 'ROOM.UPDATED',
      data: room,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.roomModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('ROOM.NOT_FOUND');
    }
    return {
      message: 'ROOM.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
