import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { FileUploadService } from '../common/services/file-upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existsUserWithLogin = await this.userModel
      .findOne({ login: createUserDto.login })
      .exec();
    if (existsUserWithLogin) {
      throw new ConflictException({
        uz: 'Bunday login mavjud',
        ru: 'Такой логин уже существует',
        en: 'User with this login already exists',
      });
    }
    const existsUserWithPhone = await this.userModel
      .findOne({ phone: createUserDto.phone })
      .exec();
    if (existsUserWithPhone) {
      throw new ConflictException({
        uz: 'Bunday telefon raqam mavjud',
        ru: 'Такой номер телефона уже существует',
        en: 'User with this phone number already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return {
      message: {
        uz: 'Foydalanuvchi muvaffaqiyatli yaratildi',
        ru: 'Пользователь успешно создан',
        en: 'User created successfully',
      },
      data: user,
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const data = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ _id: 1 })
      .exec();
    const total = await this.userModel.countDocuments();
    if (data.length === 0) {
      return {
        message: {
          uz: 'Hozircha foydalanuvchilar mavjud emas',
          ru: 'Пока что нет пользователей',
          en: 'No users yet',
        },
        data: [],
        success: true,
      };
    }
    return {
      message: {
        uz: 'Foydalanuvchilar ro‘yxati',
        ru: 'Список пользователей',
        en: 'List of users',
      },
      data: { users: data, total, page, limit },
      success: true,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('students')
      .populate('staffs')
      .exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return {
      message: {
        uz: 'Foydalanuvchi topildi',
        ru: 'Пользователь найден',
        en: 'User found',
      },
      data: user,
      success: true,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    if (updateUserDto.login || updateUserDto.phone) {
      return {
        message: {
          uz: 'Login va telefon raqam yangilash uchun admin bilan bog‘laning.',
          ru: 'Обновить логин и номер телефона можно связавшись с администратором.',
          en: 'To update login and phone number, please contact the administrator.',
        },
        data: null,
        success: false,
      };
    }
    if (updateUserDto.password) {
      return {
        message: {
          uz: 'Parolni yangilash uchun alohida yo‘nalish mavjud.',
          ru: 'Для обновления пароля существует отдельный маршрут.',
          en: 'There is a separate route for updating the password.',
        },
        data: null,
        success: false,
      };
    }
    const updated = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return {
      message: {
        uz: 'Foydalanuvchi muvaffaqiyatli yangilandi',
        ru: 'Пользователь успешно обновлен',
        en: 'User updated successfully',
      },
      data: updated,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return {
      message: {
        uz: 'Foydalanuvchi muvaffaqiyatli o‘chirildi',
        ru: 'Пользователь успешно удален',
        en: 'User deleted successfully',
      },
      data: { affected: 1 },
      success: true,
    };
  }

  async findUserByLogin(login: string) {
    return this.userModel.findOne({ login }).exec();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { refreshToken }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return user;
  }

  async updatePassword(id: string, password: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    await this.userModel.findByIdAndUpdate(id, { password: hashedPassword }).exec();
    return {
      message: {
        uz: 'Parol muvaffaqiyatli yangilandi!',
        ru: 'Пароль успешно обновлен!',
        en: 'Password updated successfully!',
      },
      success: true,
    };
  }

  async userProfile(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('students')
      .exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return {
      message: {
        uz: "Foydalanuvchi ma'lumotlari",
        ru: 'Данные пользователя',
        en: 'User data',
      },
      data: user,
      success: true,
    };
  }

  async uploadUserAvatar(id: string, file: Express.Multer.File) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    if (user.avatarUrl) {
      const oldFilename = user.avatarUrl.split('/').pop();
      if (oldFilename) {
        await this.fileUploadService.deleteFile(oldFilename);
      }
    }
    const avatarUrl = this.fileUploadService.getFileUrl(file.filename);
    await this.userModel.findByIdAndUpdate(id, {
      avatarUrl: `${process.env.API_HOST}${avatarUrl}`,
    }).exec();
    return {
      message: {
        uz: 'Foydalanuvchi avatari muvaffaqiyatli yuklandi',
        ru: 'Аватар пользователя успешно загружен',
        en: 'User avatar uploaded successfully',
      },
      data: { avatarUrl: `${process.env.API_HOST}${avatarUrl}` },
      success: true,
    };
  }

  async deleteUserAvatar(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    if (user.avatarUrl) {
      const filename = user.avatarUrl.split('/').pop();
      if (filename) {
        await this.fileUploadService.deleteFile(filename);
      }
      await this.userModel.findByIdAndUpdate(id, { avatarUrl: '' }).exec();
    }
    return {
      message: {
        uz: "Foydalanuvchi avatari muvaffaqiyatli o'chirildi",
        ru: 'Аватар пользователя успешно удален',
        en: 'User avatar deleted successfully',
      },
      data: { avatarUrl: null },
      success: true,
    };
  }
}
