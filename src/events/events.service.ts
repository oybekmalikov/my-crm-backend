import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const event = await this.eventModel.create(createEventDto);
    return {
      message: 'EVENT.CREATED',
      data: event,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1, status?: string) {
    const skip = (page - 1) * limit;
    const query = status ? { status } : {};
    const data = await this.eventModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.eventModel.countDocuments(query);

    if (data.length === 0) {
      return {
        message: 'EVENT.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'EVENT.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('students')
      .exec();
    if (!event) {
      throw new NotFoundException('EVENT.NOT_FOUND');
    }
    return {
      message: 'EVENT.FOUND',
      data: event,
      success: true,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!event) {
      throw new NotFoundException('EVENT.NOT_FOUND');
    }
    return {
      message: 'EVENT.UPDATED',
      data: event,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('EVENT.NOT_FOUND');
    }
    return {
      message: 'EVENT.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async updateEventParams(
    eventId: string,
    newStatus?: string,
    newDate?: string,
    newTime?: string,
  ) {
    const event = await this.eventModel.findById(eventId).exec();
    if (!event) {
      throw new NotFoundException('EVENT.NOT_FOUND');
    }
    if (newStatus) event.status = newStatus;
    if (newDate) event.date = newDate;
    if (newTime) event.time = newTime;

    await event.save();

    return {
      message: 'EVENT.UPDATED',
      data: event,
      success: true,
    };
  }
}
