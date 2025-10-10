import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentsService } from '../students/students.service';
import { CreateStudentsEventDto } from './dto/create-students_event.dto';
import { UpdateStudentsEventDto } from './dto/update-students_event.dto';
import { StudentsEvent } from './entities/students_event.entity';

@Injectable()
export class StudentsEventsService {
  constructor(
    @InjectRepository(StudentsEvent)
    private studentsEventRepo: Repository<StudentsEvent>,
    private readonly studentsService: StudentsService,
  ) {}
  async create(createStudentsEventDto: CreateStudentsEventDto) {
    const studentEvent = this.studentsEventRepo.create(createStudentsEventDto);
    return {
      message: {
        uz: 'Student uchun event muvaffaqiyatli yaratildi',
        ru: 'Событие для студента успешно создано',
        en: 'Event for student created successfully',
      },
      data: await this.studentsEventRepo.save(studentEvent),
      success: true,
    };
  }

  async findAll(
    limit: number = 10,
    page: number = 1,
    isAttended?: boolean,
    eventStatus?: string,
  ) {
    const [data, total] = await this.studentsEventRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
      relations: ['student', 'event'],
      where:
        isAttended && eventStatus
          ? { isAttended, event: { status: eventStatus } }
          : eventStatus
            ? { event: { status: eventStatus } }
            : isAttended
              ? { isAttended }
              : {},
    });
    if (data.length === 0) {
      return {
        message: {
          uz: 'Hozircha eventlaringiz mavjud emas',
          ru: 'Пока что нет событий',
          en: 'No events yet',
        },
        data: [],
        success: true,
      };
    }
    return {
      message: {
        uz: 'Eventlaringiz ro‘yxati',
        ru: 'Список событий',
        en: 'List of events',
      },
      data: { studentsEvent: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: number) {
    const studentEvent = await this.studentsEventRepo.findOne({
      relations: ['student', 'event'],
      where: { id },
    });
    if (!studentEvent) {
      throw new NotFoundException({
        uz: 'Event topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    return {
      message: {
        uz: 'Event topildi',
        ru: 'Событие найдено',
        en: 'Event found',
      },
      data: studentEvent,
      success: true,
    };
  }

  async update(id: number, updateStudentsEventDto: UpdateStudentsEventDto) {
    const studentEvent = await this.studentsEventRepo.preload({
      id,
      ...updateStudentsEventDto,
    });
    if (!studentEvent) {
      throw new NotFoundException({
        uz: 'Event topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    return {
      message: {
        uz: 'Event muvaffaqiyatli yangilandi',
        ru: 'Событие успешно обновлено',
        en: 'Event updated successfully',
      },
      data: await this.studentsEventRepo.save(studentEvent),
      success: true,
    };
  }

  async remove(id: number) {
    const studentEvent = await this.studentsEventRepo.findOne({
      where: { id },
    });
    if (!studentEvent) {
      throw new NotFoundException({
        uz: 'Event topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    const deleted = await this.studentsEventRepo.delete({ id });
    if (!deleted.affected) {
      return {
        message: {
          uz: 'Event topilmadi',
          ru: 'Событие не найдено',
          en: 'Event not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Event muvaffaqiyatli o‘chirildi',
        ru: 'Событие успешно удалено',
        en: 'Event deleted successfully',
      },
      data: { affected: deleted.affected },
      success: true,
    };
  }
  async setStudentAttended(id: number, isAttended: boolean) {
    const studentEvent = await this.studentsEventRepo.findOne({
      where: { id },
      relations: ['student', 'event'],
    });
    if (!studentEvent) {
      throw new NotFoundException({
        uz: 'Event topilmadi',
        ru: 'Событие не найдено',
        en: 'Event not found',
      });
    }
    studentEvent.isAttended = isAttended;
    if (isAttended) {
      await this.studentsService.updateXP_Points(
        studentEvent.student.id,
        0,
        studentEvent.event.pointForEvent,
      );
    }
    return {
      message: {
        uz: 'Event muvaffaqiyatli yangilandi',
        ru: 'Событие успешно обновлено',
        en: 'Event updated successfully',
      },
      data: await this.studentsEventRepo.save(studentEvent),
      success: true,
    };
  }
}
