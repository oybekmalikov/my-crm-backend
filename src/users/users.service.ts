import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { FileUploadService } from '../common/services/file-upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

/** bcrypt cost factor. 12 is the current OWASP-recommended minimum. */
export const BCRYPT_SALT_ROUNDS = 12;
/** Lock the account after this many consecutive failed logins. */
export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
/** How long an account stays locked once the threshold above is hit. */
export const ACCOUNT_LOCK_DURATION_MS = 15 * 60 * 1000;
/** How long a password-reset token stays valid. */
export const PASSWORD_RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

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
      throw new ConflictException('USER.LOGIN_ALREADY_EXISTS');
    }
    const existsUserWithPhone = await this.userModel
      .findOne({ phone: createUserDto.phone })
      .exec();
    if (existsUserWithPhone) {
      throw new ConflictException('USER.PHONE_ALREADY_EXISTS');
    }
    if (createUserDto.email) {
      const existsUserWithEmail = await this.userModel
        .findOne({ email: createUserDto.email })
        .exec();
      if (existsUserWithEmail) {
        throw new ConflictException('USER.EMAIL_ALREADY_EXISTS');
      }
    }
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_SALT_ROUNDS,
    );
    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return {
      message: 'USER.CREATED',
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
        message: 'USER.LIST_EMPTY',
        data: [],
        success: true,
      };
    }
    return {
        message: 'USER.LIST_FOUND',
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
      throw new NotFoundException('USER.NOT_FOUND');
    }
    return {
        message: 'USER.FOUND',
      data: user,
      success: true,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    if (updateUserDto.login || updateUserDto.phone) {
      return {
        message: 'USER.UPDATE_LOGIN_PHONE_CONTACT_ADMIN',
        data: null,
        success: false,
      };
    }
    if (updateUserDto.password) {
      return {
        message: 'USER.UPDATE_PASSWORD_ROUTE',
        data: null,
        success: false,
      };
    }
    const updated = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return {
        message: 'USER.UPDATED',
      data: updated,
      success: true,
    };
  }

  /**
   * Self-service profile update for the authenticated user. Deliberately
   * narrower than the admin `update()` method: login/phone/password/role
   * changes go through their dedicated, more carefully guarded routes.
   */
  async updateProfile(
    id: string,
    dto: { firstName?: string; lastName?: string; middleName?: string; email?: string },
  ) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    if (dto.email) {
      const existsUserWithEmail = await this.userModel
        .findOne({ email: dto.email, _id: { $ne: id } })
        .exec();
      if (existsUserWithEmail) {
        throw new ConflictException('USER.EMAIL_ALREADY_EXISTS');
      }
    }
    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...(dto.firstName !== undefined && { firstName: dto.firstName }),
          ...(dto.lastName !== undefined && { lastName: dto.lastName }),
          ...(dto.middleName !== undefined && { middleName: dto.middleName }),
          ...(dto.email !== undefined && { email: dto.email }),
        },
        { new: true },
      )
      .exec();
    return {
      message: 'USER.UPDATED',
      data: updated,
      success: true,
    };
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    return {
        message: 'USER.DELETED',
      data: { affected: 1 },
      success: true,
    };
  }

  async findUserByLogin(login: string) {
    return this.userModel
      .findOne({ login })
      .select('+password +refreshToken +failedLoginAttempts +lockedUntil')
      .exec();
  }

  async findUserByLoginOrEmail(loginOrEmail: string) {
    return this.userModel
      .findOne({
        $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
      })
      .exec();
  }

  /**
   * Internal-only lookup that includes the hashed password / refresh token.
   * Used exclusively by AuthService flows (password compare, refresh-token
   * validation). Never expose the result of this method in an HTTP response.
   */
  async findOneWithSecrets(id: string) {
    return this.userModel
      .findById(id)
      .select('+password +refreshToken +failedLoginAttempts +lockedUntil')
      .exec();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { refreshToken }, { new: true }).exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    return user;
  }

  async updatePassword(id: string, password: string) {
    const user = await this.userModel.findById(id).select('+password').exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    // Force re-login everywhere else: a changed password should immediately
    // invalidate any refresh token issued before the change.
    await this.userModel
      .findByIdAndUpdate(id, {
        password: hashedPassword,
        refreshToken: '',
      })
      .exec();
    return {
        message: 'USER.PASSWORD_UPDATED',
      success: true,
    };
  }

  /** Records a failed login attempt and locks the account past the threshold. */
  async registerFailedLogin(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) return;
    const attempts = (user.failedLoginAttempts || 0) + 1;
    const update: Partial<User> = { failedLoginAttempts: attempts };
    if (attempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      update.lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS);
    }
    await this.userModel.findByIdAndUpdate(id, update).exec();
  }

  /** Clears the failed-login counter/lock after a successful sign-in. */
  async clearFailedLogins(id: string) {
    await this.userModel
      .findByIdAndUpdate(id, { failedLoginAttempts: 0, lockedUntil: null })
      .exec();
  }

  /**
   * Generates a one-time password-reset token for the given user, stores
   * only its SHA-256 hash (so a DB leak can't be used to reset passwords),
   * and returns the plaintext token to be emailed to the user.
   */
  async createPasswordResetToken(id: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await this.userModel
      .findByIdAndUpdate(id, {
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: new Date(
          Date.now() + PASSWORD_RESET_TOKEN_TTL_MS,
        ),
      })
      .exec();
    return token;
  }

  async findByValidPasswordResetToken(token: string) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return this.userModel
      .findOne({
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: { $gt: new Date() },
      })
      .select('+passwordResetTokenHash +passwordResetExpires')
      .exec();
  }

  async resetPasswordWithToken(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await this.userModel
      .findByIdAndUpdate(id, {
        password: hashedPassword,
        refreshToken: '',
        passwordResetTokenHash: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      })
      .exec();
    return { message: 'USER.PASSWORD_UPDATED', success: true };
  }

  async userProfile(id: string) {
    const user = await this.userModel
      .findById(id)
      .populate('students')
      .exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    return {
        message: 'USER.PROFILE_DATA',
      data: user,
      success: true,
    };
  }

  async uploadUserAvatar(id: string, file: Express.Multer.File) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
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
        message: 'USER.AVATAR_UPLOADED',
      data: { avatarUrl: `${process.env.API_HOST}${avatarUrl}` },
      success: true,
    };
  }

  async deleteUserAvatar(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('USER.NOT_FOUND');
    }
    if (user.avatarUrl) {
      const filename = user.avatarUrl.split('/').pop();
      if (filename) {
        await this.fileUploadService.deleteFile(filename);
      }
      await this.userModel.findByIdAndUpdate(id, { avatarUrl: '' }).exec();
    }
    return {
        message: 'USER.AVATAR_DELETED',
      data: { avatarUrl: null },
      success: true,
    };
  }
}
