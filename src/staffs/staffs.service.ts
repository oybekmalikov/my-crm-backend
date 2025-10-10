import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffsService {
  constructor(@InjectRepository(Staff) private staffRepo: Repository<Staff>) {}
  async create(createStaffDto: CreateStaffDto) {
    const staff = this.staffRepo.create(createStaffDto);
    return {
      message: {
        uz: 'Ishchi muvaffaqiyatli yaratildi',
        ru: 'Сотрудник успешно создан',
        en: 'Staff created successfully',
      },
      data: await this.staffRepo.save(staff),
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const [data, total] = await this.staffRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    if (data.length === 0) {
      return {
        message: {
          uz: 'Hozircha ishchilar mavjud emas',
          ru: 'Пока что нет сотрудников',
          en: 'No staffs yet',
        },
        data: [],
        success: true,
      };
    }
    return {
      message: {
        uz: 'Ishchilar ro‘yxati',
        ru: 'Список сотрудников',
        en: 'List of staffs',
      },
      data: { staffs: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: number) {
    const staffs = await this.staffRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!staffs) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi topildi',
        ru: 'Сотрудник найден',
        en: 'Staff found',
      },
      data: staffs,
      success: true,
    };
  }
  async findOneByUserId(userId: number) {
    const staff = await this.staffRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi topildi',
        ru: 'Сотрудник найден',
        en: 'Staff found',
      },
      data: staff,
      success: true,
    };
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    const staff = await this.findOne(id);
    if (!staff.data) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    const updated = await this.staffRepo.preload({ id, ...updateStaffDto });
    if (!updated) {
      return {
        message: {
          uz: 'Ishchi topilmadi',
          ru: 'Сотрудник не найден',
          en: 'Staff not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Ishchi muvaffaqiyatli yangilandi',
        ru: 'Сотрудник успешно обновлен',
        en: 'Staff updated successfully',
      },
      data: await this.staffRepo.save(updated),
      success: true,
    };
  }

  async remove(id: number) {
    const staff = await this.findOne(id);
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    const deleted = await this.staffRepo.delete({ id });
    if (!deleted.affected) {
      return {
        message: {
          uz: 'Ishchi topilmadi',
          ru: 'Сотрудник не найден',
          en: 'Staff not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Ishchi muvaffaqiyatli o‘chirildi',
        ru: 'Сотрудник успешно удален',
        en: 'Staff deleted successfully',
      },
      data: { affected: deleted.affected },
      success: true,
    };
  }

  async updateStaffsSalary(userId: number, salary: number) {
    const staff = await this.staffRepo.findOne({ where: { id: userId } });
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    staff.salary = salary;
    return {
      message: {
        uz: 'Ishchi maoshi muvaffaqiyatli yangilandi',
        ru: 'Зарплата сотрудника успешно обновлена',
        en: 'Staff salary updated successfully',
      },
      data: await this.staffRepo.save(staff),
      success: true,
    };
  }

  async setStaffsSalaryToPaid(userId: number) {
    const staff = await this.staffRepo.findOne({ where: { id: userId } });
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    staff.salary_paid_for_last_month = true;
    return {
      message: {
        uz: 'Ishchi maoshi to‘landi deb belgilandi',
        ru: 'Зарплата сотрудника отмечена как выплаченная',
        en: 'Staff salary marked as paid',
      },
      data: await this.staffRepo.save(staff),
      success: true,
    };
  }

  async updateStaffsPosition(userId: number, position: string) {
    const staff = await this.staffRepo.findOne({ where: { id: userId } });
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    staff.position = position;
    return {
      message: {
        uz: 'Ishchi lavozimi muvaffaqiyatli yangilandi',
        ru: 'Должность сотрудника успешно обновлена',
        en: 'Staff position updated successfully',
      },
      data: await this.staffRepo.save(staff),
      success: true,
    };
  }
}
