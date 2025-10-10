import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { STUDENT_POINTS_LEVELS, STUDENT_XP_LEVELS } from '../app.constants';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepo.create(createStudentDto);
    return {
      message: {
        uz: 'Student muvaffaqiyatli yaratildi',
        ru: 'Студент успешно создан',
        en: 'Student created successfully',
      },
      data: await this.studentRepo.save(student),
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const [data, total] = await this.studentRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    if (data.length === 0) {
      return {
        message: {
          uz: 'Hozircha studentlar mavjud emas',
          ru: 'Пока что нет студентов',
          en: 'No students yet',
        },
        data: [],
        success: true,
      };
    }
    return {
      message: {
        uz: 'Studentlar ro‘yxati',
        ru: 'Список студентов',
        en: 'List of students',
      },
      data: { students: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: number) {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!student) {
      throw new NotFoundException({
        uz: 'Student topilmadi',
        ru: 'Студент не найден',
        en: 'Student not found',
      });
    }
    return {
      message: {
        uz: 'Student topildi',
        ru: 'Студент найден',
        en: 'Student found',
      },
      data: student,
      success: true,
    };
  }
  async findOneByUserId(userId: number) {
    const student = await this.studentRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!student) {
      throw new NotFoundException({
        uz: 'Student topilmadi',
        ru: 'Студент не найден',
        en: 'Student not found',
      });
    }
    return {
      message: {
        uz: 'Student topildi',
        ru: 'Студент найден',
        en: 'Student found',
      },
      data: student,
      success: true,
    };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (!student.data) {
      throw new NotFoundException({
        uz: 'Student topilmadi',
        ru: 'Студент не найден',
        en: 'Student not found',
      });
    }
    const updated = await this.studentRepo.preload({ id, ...updateStudentDto });
    if (!updated) {
      return {
        message: {
          uz: 'Student topilmadi',
          ru: 'Студент не найден',
          en: 'Student not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Student muvaffaqiyatli yangilandi',
        ru: 'Студент успешно обновлен',
        en: 'Student updated successfully',
      },
      data: await this.studentRepo.save(updated),
      success: true,
    };
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    if (!student) {
      throw new NotFoundException({
        uz: 'Student topilmadi',
        ru: 'Студент не найден',
        en: 'Student not found',
      });
    }
    const deleted = await this.studentRepo.delete({ id });
    if (!deleted.affected) {
      return {
        message: {
          uz: 'Student topilmadi',
          ru: 'Студент не найден',
          en: 'Student not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Student muvaffaqiyatli o‘chirildi',
        ru: 'Студент успешно удален',
        en: 'Student deleted successfully',
      },
      data: { affected: deleted.affected },
      success: true,
    };
  }

  async updateXP_Points(
    id: number,
    added_xp: number = 0,
    added_point: number = 0,
  ) {
    const student = await this.findOne(id);
    const { level, xp, point } = student.data;
    if (STUDENT_XP_LEVELS[level] > xp + added_xp) {
      if (added_point === 0) {
        await this.studentRepo.update(
          { id },
          {
            level: level + 1,
            xp: xp + added_xp,
            point: STUDENT_POINTS_LEVELS[level] * xp,
          },
        );
      } else {
        await this.studentRepo.update(
          { id },
          { level: level + 1, xp: xp + added_xp, point: point + added_point },
        );
      }
    } else {
      if (added_point === 0) {
        await this.studentRepo.update(
          { id },
          {
            xp: xp + added_xp,
            point: STUDENT_POINTS_LEVELS[level] * xp,
          },
        );
      } else {
        await this.studentRepo.update(
          { id },
          { xp: xp + added_xp, point: point + added_point },
        );
      }
    }
    return {
      message: {
        uz: 'Studentning XP va pointlari muvaffaqiyatli yangilandi',
        ru: 'XP и очки студента успешно обновлены',
        en: 'Student XP and points updated successfully',
      },
      data: (await this.findOne(id)).data,
      success: true,
    };
  }
}
