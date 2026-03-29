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
      message: {
        uz: 'Tadbir muvaffaqiyatli qo`shildi',
        ru: 'Событие успешно добавлено',
        en: 'Event added successfully',
      },
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
        message: {
          uz: 'Hozircha tadbirlar mavjud emas',
          ru: 'Пока что нет событий',
          en: 'No events yet',
        },
        data: [],
        success: true,
      };
    }
    return {
      message: {
        uz: 'Tadbirlar ro‘yxati',
        ru: 'Список событий',
        en: 'List of events',
      },
      data: { events: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('students')
      .exec();
    if (!event) {
      throw new NotFoundException({
        uz: 'Tadbir topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    return {
      message: {
        uz: 'Tadbir topildi',
        ru: 'Событие найдено',
        en: 'Event found',
      },
      data: event,
      success: true,
    };
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!event) {
      throw new NotFoundException({
        uz: 'Tadbir topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    return {
      message: {
        uz: 'Tadbir muvaffaqiyatli yangilandi',
        ru: 'Событие успешно обновлено',
        en: 'Event updated successfully',
      },
      data: event,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException({
        uz: 'Tadbir topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    return {
      message: {
        uz: 'Tadbir muvaffaqiyatli o‘chirildi',
        ru: 'Событие успешно удалено',
        en: 'Event deleted successfully',
      },
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
      throw new NotFoundException({
        uz: 'Tadbir topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    if (newStatus) event.status = newStatus;
    if (newDate) event.date = newDate;
    if (newTime) event.time = newTime;

    await event.save();

    return {
      message: {
        uz: 'Tadbir muvaffaqiyatli yangilandi',
        ru: 'Событие успешно обновлено',
        en: 'Event updated successfully',
      },
      data: event,
      success: true,
    };
  }
}
