import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAccountSettingDto } from './dto/create-account_setting.dto';
import { UpdateAccountSettingDto } from './dto/update-account_setting.dto';
import { AccountSetting, AccountSettingDocument } from './entities/account_setting.entity';

@Injectable()
export class AccountSettingsService {
  constructor(
    @InjectModel(AccountSetting.name)
    private accountSettingModel: Model<AccountSettingDocument>,
  ) {}

  async create(createAccountSettingDto: CreateAccountSettingDto) {
    const existing = await this.accountSettingModel
      .findOne({ userId: createAccountSettingDto.userId })
      .exec();
    if (existing) {
      throw new ConflictException('ACCOUNT_SETTING.ALREADY_EXISTS');
    }

    const accountSetting = await this.accountSettingModel.create(
      createAccountSettingDto,
    );
    return {
      message: 'ACCOUNT_SETTING.CREATED',
      data: accountSetting,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.accountSettingModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.accountSettingModel.countDocuments();

    if (data.length === 0) {
      return {
        message: 'ACCOUNT_SETTING.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
      message: 'ACCOUNT_SETTING.LIST_FOUND',
      data: { data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const accountSetting = await this.accountSettingModel.findById(id).exec();
    if (!accountSetting) {
      throw new NotFoundException('ACCOUNT_SETTING.NOT_FOUND');
    }
    return {
      message: 'ACCOUNT_SETTING.FOUND',
      data: accountSetting,
      success: true,
    };
  }

  async findByUserId(userId: string) {
    const accountSetting = await this.accountSettingModel
      .findOne({ userId })
      .exec();
    if (!accountSetting) {
      throw new NotFoundException('ACCOUNT_SETTING.NOT_FOUND');
    }
    return {
      message: 'ACCOUNT_SETTING.FOUND',
      data: accountSetting,
      success: true,
    };
  }

  async update(id: string, updateAccountSettingDto: UpdateAccountSettingDto) {
    const accountSetting = await this.accountSettingModel
      .findByIdAndUpdate(id, updateAccountSettingDto, { new: true })
      .exec();
    if (!accountSetting) {
      throw new NotFoundException('ACCOUNT_SETTING.NOT_FOUND');
    }
    return {
      message: 'ACCOUNT_SETTING.UPDATED',
      data: accountSetting,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.accountSettingModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('ACCOUNT_SETTING.NOT_FOUND');
    }
    return {
      message: 'ACCOUNT_SETTING.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }
}
