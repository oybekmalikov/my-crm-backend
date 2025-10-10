import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { FileUploadService } from '../common/services/file-upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly fileUploadService: FileUploadService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const existsUserWithLogin = await this.userRepo.findOne({
      where: { login: createUserDto.login },
    });
    if (existsUserWithLogin) {
      throw new ConflictException({
        uz: 'Bunday login mavjud',
        ru: 'Такой логин уже существует',
        en: 'User with this login already exists',
      });
    }
    const existsUserWithPhone = await this.userRepo.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existsUserWithPhone) {
      throw new ConflictException({
        uz: 'Bunday telefon raqam mavjud',
        ru: 'Такой номер телефона уже существует',
        en: 'User with this phone number already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return {
      message: {
        uz: 'Foydalanuvchi muvaffaqiyatli yaratildi',
        ru: 'Пользователь успешно создан',
        en: 'User created successfully',
      },
      data: await this.userRepo.save(user),
      success: true,
    };
  }

  async findAll(limit: number = 10, page: number = 1) {
    const [data, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
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

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['students', 'staffs'],
    });
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user.data) {
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
    const updated = await this.userRepo.preload({ id, ...updateUserDto });
    if (!updated) {
      return {
        message: {
          uz: 'Foydalanuvchi topilmadi',
          ru: 'Пользователь не найден',
          en: 'User not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Foydalanuvchi muvaffaqiyatli yangilandi',
        ru: 'Пользователь успешно обновлен',
        en: 'User updated successfully',
      },
      data: await this.userRepo.save(updated),
      success: true,
    };
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    const deleted = await this.userRepo.delete({ id });
    if (!deleted.affected) {
      return {
        message: {
          uz: 'Foydalanuvchi topilmadi',
          ru: 'Пользователь не найден',
          en: 'User not found',
        },
        data: null,
        success: false,
      };
    }
    return {
      message: {
        uz: 'Foydalanuvchi muvaffaqiyatli o‘chirildi',
        ru: 'Пользователь успешно удален',
        en: 'User deleted successfully',
      },
      data: { affected: deleted.affected },
      success: true,
    };
  }
  async findUserByLogin(login: string) {
    return this.userRepo.findOne({ where: { login } });
  }
  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.findOne(id);
    if (!user.data) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return this.userRepo.update(id, { refreshToken });
  }
  async updatePassword(id: number, password: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 7);
    await this.userRepo.update({ id }, { password: hashedPassword });
    return {
      message: {
        uz: 'Parol muvaffaqiyatli yangilandi!',
        ru: 'Пароль успешно обновлен!',
        en: 'Password updated successfully!',
      },
      success: true,
    };
  }
  async userProfile(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['students'],
    });
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
  async uploadUserAvatar(id: number, file: Express.Multer.File) {
    const user = await this.findOne(id);
    if (!user?.data) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    if (user.data.avatarUrl) {
      const oldFilename = user.data.avatarUrl.split('/').pop();
      if (oldFilename) {
        await this.fileUploadService.deleteFile(oldFilename);
      }
    }
    const avatarUrl = this.fileUploadService.getFileUrl(file.filename);
    await this.userRepo.update(
      { id },
      { avatarUrl: `${process.env.API_HOST}${avatarUrl}` },
    );
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

  async deleteUserAvatar(id: number) {
    const user = await this.findOne(id);
    if (!user?.data) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    if (user.data.avatarUrl) {
      const filename = user.data.avatarUrl.split('/').pop();
      if (filename) {
        await this.fileUploadService.deleteFile(filename);
      }
      await this.userRepo.update({ id }, { avatarUrl: '' });
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
