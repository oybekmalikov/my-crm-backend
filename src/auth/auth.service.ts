import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { EmailService } from '../common/services/email.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';

/** Cookie flags shared by every place that sets/clears the refresh-token cookie. */
function refreshTokenCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: Number(process.env.COOKIE_TIME),
  };
}

/**
 * `ACCESS_TOKEN_TIME`/`REFRESH_TOKEN_TIME` are validated at bootstrap by
 * `envValidationSchema` (see `src/config/env.validation.ts`) against a
 * `\d+(ms|s|m|h|d|w|y)?` pattern, so by the time this runs the value is
 * guaranteed to be a valid jsonwebtoken `expiresIn` string. This helper just
 * documents/asserts that instead of silently casting with `as any`.
 */
function jwtExpiresIn(
  value: string | undefined,
  envVarName: string,
): JwtSignOptions['expiresIn'] {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${envVarName}. This should have been caught by env validation at startup.`,
    );
  }
  return value as JwtSignOptions['expiresIn'];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
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
        expiresIn: jwtExpiresIn(
          process.env.ACCESS_TOKEN_TIME,
          'ACCESS_TOKEN_TIME',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: jwtExpiresIn(
          process.env.REFRESH_TOKEN_TIME,
          'REFRESH_TOKEN_TIME',
        ),
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
    const userId = (user as any)._id.toString();
    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new ForbiddenException('AUTH.ACCOUNT_LOCKED');
    }
    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isValidPassword) {
      await this.usersService.registerFailedLogin(userId);
      throw new BadRequestException('AUTH.INVALID_LOGIN_OR_PASSWORD');
    }
    if (!user.isActive) {
      throw new BadRequestException('AUTH.INACTIVE_ACCOUNT');
    }
    await this.usersService.clearFailedLogins(userId);
    const { accessToken, refreshToken } = await this.generateTokens(user);
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions());
    await this.usersService.updateRefreshToken(userId, refreshToken);
    return {
      message: 'AUTH.LOGGED_IN',
      data: {
        accessToken,
        userId,
        role: user.role,
      },
      success: true,
    };
  }
  async signOut(refreshToken: string, res: Response) {
    let userData: any;
    try {
      userData = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch {
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const genericResponse = {
      message: 'AUTH.PASSWORD_RESET_EMAIL_SENT_IF_ACCOUNT_EXISTS',
      data: null,
      success: true,
    };
    const user = await this.usersService.findUserByLoginOrEmail(
      dto.loginOrEmail,
    );
    // Always return the same generic response whether or not the account
    // exists, and whether or not it has an email on file — this prevents
    // user enumeration through this endpoint.
    if (!user || !user.email) {
      return genericResponse;
    }
    const token = await this.usersService.createPasswordResetToken(
      (user as any)._id.toString(),
    );
    await this.emailService.sendPasswordResetEmail(user.email, token);
    return genericResponse;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.findByValidPasswordResetToken(
      dto.token,
    );
    if (!user) {
      throw new BadRequestException('AUTH.INVALID_OR_EXPIRED_RESET_TOKEN');
    }
    return this.usersService.resetPasswordWithToken(
      (user as any)._id.toString(),
      dto.newPassword,
    );
  }

  async refreshTokenUser(userId: string, refresh_token: string, res: Response) {
    let decodedToken: any;
    try {
      decodedToken = await this.jwtService.verifyAsync(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
    } catch {
      throw new ForbiddenException('AUTH.UNAUTHORIZED');
    }
    if (userId !== decodedToken['userId']) {
      throw new ForbiddenException('AUTH.UNAUTHORIZED');
    }
    const user = await this.usersService.findOneWithSecrets(userId);
    if (!user) {
      throw new NotFoundException('AUTH.USER_NOT_FOUND');
    }
    // The refresh token must match the one currently on file: this rejects
    // tokens that were already rotated out (reuse after logout/refresh) or
    // that predate an administrator forcing a logout by clearing the field.
    if (!user.refreshToken || user.refreshToken !== refresh_token) {
      throw new ForbiddenException('AUTH.UNAUTHORIZED');
    }
    const { accessToken, refreshToken } = await this.generateTokens(
      user as any,
    );
    await this.usersService.updateRefreshToken(
      (user as any)._id.toString(),
      refreshToken,
    );
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions());
    return {
      message: 'AUTH.TOKEN_REFRESHED',
      data: { userId: (user as any)._id.toString(), accessToken },
      success: true,
    };
  }
  async updatePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
    userId: string,
  ) {
    const user = await this.usersService.findOneWithSecrets(userId);
    if (!user) {
      throw new NotFoundException('AUTH.USER_NOT_FOUND');
    }
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      user.password,
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
