import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateTokens(user: User | any) {
    const payload = {
      userId: user._id || user.id,
      login: user.login,
      role: user.role,
      // studentId: user.students[0]?.id,
      // staffId: user.staffs[0]?.id,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async signIn(signInDto: SignInDto, res: Response) {
    const user = await this.usersService.findUserByLogin(signInDto.login);
    if (!user) {
      throw new BadRequestException({
        uz: "Login yoki parol noto'g'ri!",
        ru: 'Неверный логин или пароль!',
        en: 'Email or password incorrect!',
      });
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException({
        uz: "Login yoki parol noto'g'ri!",
        ru: 'Неверный логин или пароль!',
        en: 'Email or password incorrect!',
      });
    }
    if (!user.isActive) {
      throw new BadRequestException({
        uz: "Hisobingiz faollashtirilmagan. Iltimos, adminstrator bilan bog'laning.",
        ru: 'Ваш аккаунт не активирован. Пожалуйста, свяжитесь с администратором.',
        en: 'Your account is not activated. Please contact the administrator.',
      });
    }
    const { accessToken, refreshToken } = await this.generateTokens(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_TIME),
    });
    await this.usersService.updateRefreshToken((user as any)._id.toString(), refreshToken);
    return {
      message: {
        uz: 'Siz muvaffaqiyatli tizimga kirdingiz.',
        ru: 'Вы успешно вошли в систему.',
        en: 'You have successfully logged in.',
      },
      data: { accessToken, userId: (user as any)._id.toString(), role: user.role },
      success: true,
    };
  }
  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException({
        uz: 'Foydalanuvchi ro‘yxatdan o‘tmagan!',
        ru: 'Неавторизованный пользователь!',
        en: 'Unauthorized user!',
      });
    }
    const user = await this.usersService.findUserByLogin(userData.login);
    if (!user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    await this.usersService.updateRefreshToken((user as any)._id.toString(), '');
    res.clearCookie('refresh_token');
    return {
      message: {
        uz: 'Siz muvaffaqiyatli tizimdan chiqdingiz.',
        ru: 'Вы успешно вышли из системы.',
        en: 'You have successfully logged out.',
      },
      data: null,
      success: true,
    };
  }

  async refreshTokenUser(userId: string, refresh_token: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refresh_token);
    if (userId !== decodedToken['userId']) {
      throw new ForbiddenException({
        uz: 'Ruxsat etilmagan foydalanuvchi!',
        ru: 'Неавторизованный пользователь!',
        en: 'Unauthorized user!',
      });
    }
    const user = await this.usersService.findOne(userId);
    if (!user && !user) {
      throw new NotFoundException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    const { accessToken, refreshToken } = await this.generateTokens(user.data! as any);
    await this.usersService.updateRefreshToken((user.data! as any)._id.toString(), refreshToken);
    res.cookie('refresh_token', refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return {
      message: {
        uz: 'Yangi token yaratildi.',
        ru: 'Создан новый токен.',
        en: 'New token created.',
      },
      data: { userId: (user.data! as any)._id.toString(), accessToken },
      success: true,
    };
  }
  async updatePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
    userId: string,
  ) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException({});
    }
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      user.data!.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException({
        uz: "Eski parol noto'g'ri!",
        ru: 'Старый пароль неверен!',
        en: 'Old password is incorrect!',
      });
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException({
        uz: 'Yangi parol va parolni tasdiqlash mos emas!',
        ru: 'Новый пароль и подтверждение пароля не совпадают!',
        en: 'New password and confirm password do not match!',
      });
    }
    const response = await this.usersService.updatePassword(
      userId,
      newPassword,
    );
    return {
      message: response.message,
      data: { userId },
      success: response.success,
    };
  }
}
