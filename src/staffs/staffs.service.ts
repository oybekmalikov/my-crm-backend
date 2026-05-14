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
      message: 'STAFF.CREATED',
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
        message: 'STAFF.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
        message: 'STAFF.LIST_FOUND',
      data: { staffs: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const staffs = await this.staffModel.findById(id).populate('user').exec();
    if (!staffs) {
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.FOUND',
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
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.FOUND',
      data: staff,
      success: true,
    };
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const updated = await this.staffModel
      .findByIdAndUpdate(id, updateStaffDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.UPDATED',
      data: updated,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.staffModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async updateStaffsSalary(userId: string, salary: number) {
    const staff = await this.staffModel
      .findByIdAndUpdate(userId, { salary }, { new: true })
      .exec();
    if (!staff) {
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.SALARY_UPDATED',
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
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.SALARY_PAID',
      data: staff,
      success: true,
    };
  }

  async updateStaffsPosition(userId: string, position: string) {
    const staff = await this.staffModel
      .findByIdAndUpdate(userId, { position }, { new: true })
      .exec();
    if (!staff) {
      throw new NotFoundException('STAFF.NOT_FOUND');
    }
    return {
        message: 'STAFF.POSITION_UPDATED',
      data: staff,
      success: true,
    };
  }
}
