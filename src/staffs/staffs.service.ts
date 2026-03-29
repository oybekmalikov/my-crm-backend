import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff, StaffDocument } from './entities/staff.entity';

@Injectable()
export class StaffsService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {}

  async create(createStaffDto: CreateStaffDto) {
    const staff = await this.staffModel.create(createStaffDto);
    return {
      message: {
        uz: 'Ishchi muvaffaqiyatli yaratildi',
        ru: 'Сотрудник успешно создан',
        en: 'Staff created successfully',
      },
      data: staff,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.staffModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.staffModel.countDocuments();

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

  async findOne(id: string) {
    const staffs = await this.staffModel.findById(id).populate('user').exec();
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

  async findOneByUserId(userId: string) {
    const staff = await this.staffModel
      .findOne({ userId })
      .populate('user')
      .exec();
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

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const updated = await this.staffModel
      .findByIdAndUpdate(id, updateStaffDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi muvaffaqiyatli yangilandi',
        ru: 'Сотрудник успешно обновлен',
        en: 'Staff updated successfully',
      },
      data: updated,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.staffModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi muvaffaqiyatli o‘chirildi',
        ru: 'Сотрудник успешно удален',
        en: 'Staff deleted successfully',
      },
      data: { affected: 1 },
      success: true,
    };
  }

  async updateStaffsSalary(userId: string, salary: number) {
    const staff = await this.staffModel
      .findByIdAndUpdate(userId, { salary }, { new: true })
      .exec();
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi maoshi muvaffaqiyatli yangilandi',
        ru: 'Зарплата сотрудника успешно обновлена',
        en: 'Staff salary updated successfully',
      },
      data: staff,
      success: true,
    };
  }

  async setStaffsSalaryToPaid(userId: string) {
    const staff = await this.staffModel
      .findByIdAndUpdate(
        userId,
        { salary_paid_for_last_month: true },
        { new: true },
      )
      .exec();
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi maoshi to‘landi deb belgilandi',
        ru: 'Зарплата сотрудника отмечена как выплаченная',
        en: 'Staff salary marked as paid',
      },
      data: staff,
      success: true,
    };
  }

  async updateStaffsPosition(userId: string, position: string) {
    const staff = await this.staffModel
      .findByIdAndUpdate(userId, { position }, { new: true })
      .exec();
    if (!staff) {
      throw new NotFoundException({
        uz: 'Ishchi topilmadi',
        ru: 'Сотрудник не найден',
        en: 'Staff not found',
      });
    }
    return {
      message: {
        uz: 'Ishchi lavozimi muvaffaqiyatli yangilandi',
        ru: 'Должность сотрудника успешно обновлена',
        en: 'Staff position updated successfully',
      },
      data: staff,
      success: true,
    };
  }
}
