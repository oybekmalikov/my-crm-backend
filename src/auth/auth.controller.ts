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
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
  @Public()
  // Stricter than the global default: brute-force login attempts are the
  // highest-value target for rate limiting on this API.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
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
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  // Public: this is called precisely when the access token has expired, so
  // it cannot require a valid access token. It is authenticated instead by
  // the httpOnly refresh-token cookie, verified inside the service.
  @Public()
  @HttpCode(200)
  @Post('refresh/:id')
  refreshTokenUser(
    @Param('id') id: string,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokenUser(id, refreshToken, res);
  }

  @ApiOperation({
    summary: 'Request a password reset email',
    description:
      'Public endpoint. Always responds the same way regardless of whether the account exists, to avoid leaking which logins/emails are registered.',
  })
  @ApiResponse({ status: 200, description: 'Request accepted.' })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @ApiOperation({
    summary: 'Reset password using an emailed token',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({
    summary: 'User new password',
    description: 'The user get new password through this endpoint.',
  })
  @ApiResponse({
    status: 200,
    description: 'User new password successfully!',
  })
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
      user.userId,
    );
  }
}
