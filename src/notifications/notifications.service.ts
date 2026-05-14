import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification, NotificationDocument } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationModel.create(createNotificationDto);
    return {
      message: 'NOTIFICATION.CREATED',
      data: notification,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1, userId?: string) {
    const skip = (page - 1) * limit;
    const query = userId ? { userId } : {};
    const data = await this.notificationModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    const total = await this.notificationModel.countDocuments(query);

    if (data.length === 0) {
      return {
        message: 'NOTIFICATION.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'NOTIFICATION.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException('NOTIFICATION.NOT_FOUND');
    }
    return {
      message: 'NOTIFICATION.FOUND',
      data: notification,
      success: true,
    };
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    if (!notification) {
      throw new NotFoundException('NOTIFICATION.NOT_FOUND');
    }
    return {
      message: 'NOTIFICATION.UPDATED',
      data: notification,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('NOTIFICATION.NOT_FOUND');
    }
    return {
      message: 'NOTIFICATION.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async markAsRead(id: string) {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
    if (!notification) {
      throw new NotFoundException('NOTIFICATION.NOT_FOUND');
    }
    return {
      message: 'NOTIFICATION.MARKED_AS_READ',
      data: notification,
      success: true,
    };
  }
}
