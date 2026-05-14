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
      throw new BadRequestException('AUTH.INVALID_LOGIN_OR_PASSWORD');
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('AUTH.INVALID_LOGIN_OR_PASSWORD');
    }
    if (!user.isActive) {
      throw new BadRequestException('AUTH.INACTIVE_ACCOUNT');
    }
    const { accessToken, refreshToken } = await this.generateTokens(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: Number(process.env.COOKIE_TIME),
    });
    await this.usersService.updateRefreshToken(
      (user as any)._id.toString(),
      refreshToken,
    );
    return {
      message: 'AUTH.LOGGED_IN',
      data: {
        accessToken,
        userId: (user as any)._id.toString(),
        role: user.role,
      },
      success: true,
    };
  }
  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('AUTH.UNAUTHORIZED');
    }
    const user = await this.usersService.findUserByLogin(userData.login);
    if (!user) {
      throw new NotFoundException('AUTH.USER_NOT_FOUND');
    }
    await this.usersService.updateRefreshToken(
      (user as any)._id.toString(),
      '',
    );
    res.clearCookie('refresh_token');
    return {
      message: 'AUTH.LOGGED_OUT',
      data: null,
      success: true,
    };
  }

  async refreshTokenUser(userId: string, refresh_token: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refresh_token);
    if (userId !== decodedToken['userId']) {
      throw new ForbiddenException('AUTH.UNAUTHORIZED');
    }
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('AUTH.USER_NOT_FOUND');
    }
    const { accessToken, refreshToken } = await this.generateTokens(
      user.data! as any,
    );
    await this.usersService.updateRefreshToken(
      (user.data! as any)._id.toString(),
      refreshToken,
    );
    res.cookie('refresh_token', refreshToken, {
      maxAge: Number(process.env.COOKIE_TIME),
      httpOnly: true,
    });
    return {
      message: 'AUTH.TOKEN_REFRESHED',
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
      throw new NotFoundException('AUTH.USER_NOT_FOUND');
    }
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      user.data!.password,
    );
    if (!isValidPassword) {
      throw new BadRequestException('AUTH.OLD_PASSWORD_INCORRECT');
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('AUTH.PASSWORDS_NOT_MATCHED');
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
