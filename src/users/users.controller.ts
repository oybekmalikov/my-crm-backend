import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { FileUploadService } from '../common/services/file-upload.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get user profile by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user profile was successfully received.',
  })
  @Get('profile')
  userProfile(@Req() req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new ForbiddenException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return this.usersService.userProfile(user.userId);
  }

  @ApiOperation({
    summary: 'Upload user profile image',
    description: 'Upload a profile image for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image uploaded successfully',
  })
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('avatar', new FileUploadService().getMulterConfig()),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    created,
  ) {
    if (!file) {
      throw new BadRequestException({
        uz: 'Fayl yuklanmadi',
        ru: 'Файл не загружен',
        en: 'File not uploaded',
      });
    }
    const user = (req as any).user;
    if (!user) {
      throw new ForbiddenException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return this.usersService.uploadUserAvatar(user.userId, file);
  }
  @ApiOperation({
    summary: 'Delete user profile image',
    description: 'Delete the profile image for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile image deleted successfully',
  })
  @Delete('delete-avatar')
  async deleteAvatar(@Req() req: Request) {
    const user = (req as any).user;
    if (!user) {
      throw new ForbiddenException({
        uz: 'Foydalanuvchi topilmadi',
        ru: 'Пользователь не найден',
        en: 'User not found',
      });
    }
    return this.usersService.deleteUserAvatar(user.id);
  }

  @ApiOperation({
    summary: 'Create user',
    description:
      'This route is responsible for creating a user. To make request to this route you must be an admin',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'This route is responsible for getting all users',
  })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully fetched.',
  })
  @Get()
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    return this.usersService.findAll(+limit, +page);
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'This route is responsible for getting a user by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully fetched.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update user by ID',
    description:
      'This route is responsible for updating a user by ID. To make request to this route you must be an admin',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({
    summary: 'Delete user by ID',
    description:
      'This route is responsible for deleting a user by ID. To make request to this route you must be an admin',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
