import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private eventRepo: Repository<Event>) {}
  async create(createEventDto: CreateEventDto) {
    const event = this.eventRepo.create(createEventDto);
    return {
      message: {
        uz: 'Tadbir muvaffaqiyatli qo`shildi',
        ru: 'Событие успешно добавлено',
        en: 'Event added successfully',
      },
      data: await this.eventRepo.save(event),
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1, status?: string) {
    const [data, total] = await this.eventRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
      relations: [],
      where: status ? { status } : {},
    });
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

  async findOne(id: number) {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ['students'],
    });
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

  async update(id: number, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepo.preload({ id, ...updateEventDto });
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
      data: await this.eventRepo.save(event),
      success: true,
    };
  }

  async remove(id: number) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException({
        uz: 'Tadbir topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    const deleted = await this.eventRepo.delete({ id });
    if (!deleted.affected) {
      return {
        message: {
          uz: 'Tadbir topilmadi',
          ru: 'Событие не найдено',
          en: 'Event not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Tadbir muvaffaqiyatli o‘chirildi',
        ru: 'Событие успешно удалено',
        en: 'Event deleted successfully',
      },
      data: { affected: deleted.affected },
      success: true,
    };
  }
  async updateEventParams(
    eventId: number,
    newStatus?: string,
    newDate?: string,
    newTime?: string,
  ) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
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
    return {
      message: {
        uz: 'Tadbir muvaffaqiyatli yangilandi',
        ru: 'Событие успешно обновлено',
        en: 'Event updated successfully',
      },
      data: await this.eventRepo.save(event),
      success: true,
    };
  }
}
