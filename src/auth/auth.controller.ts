import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: 'Users log-in',
    description: 'Users log in through this endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully!',
  })
  @HttpCode(200)
  @Post('log-in')
  async signInUser(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @ApiOperation({
    summary: 'Users log-out',
    description: 'Users log out through this endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully!',
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Post('log-out')
  async signOutUser(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  @ApiOperation({
    summary: 'User refresh token',
    description: 'The user renews their token through this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'User refreshed successfully!',
  })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('refresh/:id')
  refreshTokenUser(
    @Param('id', ParseIntPipe) id: number,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokenUser(id, refreshToken, res);
  }

  @ApiOperation({
    summary: 'User new password',
    description: 'The user get new password through this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'User new password successfully!',
  })
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Post('update-password')
  async newPassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @Req() req: Request,
  ) {
    const user = (req as any).user;
    return this.authService.updatePassword(
      oldPassword,
      newPassword,
      confirmPassword,
      user.id,
    );
  }
}
