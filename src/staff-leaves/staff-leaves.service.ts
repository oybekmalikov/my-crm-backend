import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { StaffsService } from '../staffs/staffs.service';
import { CreateStaffLeaveDto } from './dto/create-staff-leave.dto';
import { DecideStaffLeaveDto } from './dto/decide-staff-leave.dto';
import { StaffLeave, StaffLeaveDocument } from './entities/staff-leave.entity';

@Injectable()
export class StaffLeavesService {
  constructor(
    @InjectModel(StaffLeave.name) private staffLeaveModel: Model<StaffLeaveDocument>,
    private readonly staffsService: StaffsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createStaffLeaveDto: CreateStaffLeaveDto) {
    // Validate the staff exists
    await this.staffsService.findOne(createStaffLeaveDto.staffId);

    const startDate = new Date(createStaffLeaveDto.startDate);
    const endDate = new Date(createStaffLeaveDto.endDate);
    if (endDate < startDate) {
      throw new BadRequestException('STAFF_LEAVE.END_DATE_BEFORE_START_DATE');
    }

    const record = await this.staffLeaveModel.create(createStaffLeaveDto);
    return {
      message: 'STAFF_LEAVE.CREATED',
      data: record,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1, staffId?: string) {
    const skip = (page - 1) * limit;
    const query: any = staffId ? { staffId } : {};
    const data = await this.staffLeaveModel
      .find(query)
      .populate('staff')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.staffLeaveModel.countDocuments(query);

    if (data.length === 0) {
      return {
        message: 'STAFF_LEAVE.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'STAFF_LEAVE.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const record = await this.staffLeaveModel.findById(id).populate('staff').exec();
    if (!record) {
      throw new NotFoundException('STAFF_LEAVE.NOT_FOUND');
    }
    return {
      message: 'STAFF_LEAVE.FOUND',
      data: record,
      success: true,
    };
  }

  async decide(id: string, dto: DecideStaffLeaveDto) {
    const record = await this.staffLeaveModel.findById(id).populate('staff').exec();
    if (!record) {
      throw new NotFoundException('STAFF_LEAVE.NOT_FOUND');
    }
    if (record.status !== 'PENDING') {
      throw new BadRequestException('STAFF_LEAVE.ALREADY_DECIDED');
    }

    record.status = dto.status;
    record.adminNote = dto.adminNote ?? null;
    record.decidedBy = dto.decidedBy as any;
    await record.save();

    // Notify the staff member's linked user account
    const staffResult = await this.staffsService.findOne(record.staffId.toString());
    const staffDoc = staffResult.data as { userId?: { toString(): string } };
    if (staffDoc?.userId) {
      const userId = staffDoc.userId.toString();
      const title = dto.status === 'APPROVED' ? 'Leave Request Approved' : 'Leave Request Rejected';
      const message =
        dto.status === 'APPROVED'
          ? `Your leave request from ${record.startDate} to ${record.endDate} has been approved.${dto.adminNote ? ' Note: ' + dto.adminNote : ''}`
          : `Your leave request from ${record.startDate} to ${record.endDate} has been rejected.${dto.adminNote ? ' Reason: ' + dto.adminNote : ''}`;

      await this.notificationsService.create({
        userId,
        title,
        message,
        type: dto.status === 'APPROVED' ? 'success' : 'warning',
      });
    }

    return {
      message: dto.status === 'APPROVED' ? 'STAFF_LEAVE.APPROVED' : 'STAFF_LEAVE.REJECTED',
      data: record,
      success: true,
    };
  }

  async getLeaveBalance(staffId: string) {
    // Validate staff exists
    await this.staffsService.findOne(staffId);

    const allLeaves = await this.staffLeaveModel.find({ staffId }).exec();

    const approved = allLeaves.filter((l) => l.status === 'APPROVED');
    const pending = allLeaves.filter((l) => l.status === 'PENDING');
    const rejected = allLeaves.filter((l) => l.status === 'REJECTED');

    // Calculate total approved leave days
    const approvedDays = approved.reduce((sum, leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return sum + days;
    }, 0);

    return {
      message: 'STAFF_LEAVE.BALANCE_FOUND',
      data: {
        staffId,
        totalApprovedDays: approvedDays,
        approvedCount: approved.length,
        pendingCount: pending.length,
        rejectedCount: rejected.length,
        history: allLeaves,
      },
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.staffLeaveModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('STAFF_LEAVE.NOT_FOUND');
    }
    return {
      message: 'STAFF_LEAVE.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
