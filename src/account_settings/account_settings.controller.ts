import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccountSettingsService } from './account_settings.service';
import { CreateAccountSettingDto } from './dto/create-account_setting.dto';
import { UpdateAccountSettingDto } from './dto/update-account_setting.dto';

@ApiTags('Account Settings')
@Controller('account-settings')
export class AccountSettingsController {
  constructor(
    private readonly accountSettingsService: AccountSettingsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create account settings for a user' })
  create(@Body() createAccountSettingDto: CreateAccountSettingDto) {
    return this.accountSettingsService.create(createAccountSettingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all account settings with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(@Query('limit') limit?: number, @Query('page') page?: number) {
    return this.accountSettingsService.findAll(limit || 10, page || 1);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account settings by ID' })
  findOne(@Param('id') id: string) {
    return this.accountSettingsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get account settings by user ID' })
  findByUserId(@Param('userId') userId: string) {
    return this.accountSettingsService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update account settings' })
  update(
    @Param('id') id: string,
    @Body() updateAccountSettingDto: UpdateAccountSettingDto,
  ) {
    return this.accountSettingsService.update(id, updateAccountSettingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete account settings' })
  remove(@Param('id') id: string) {
    return this.accountSettingsService.remove(id);
  }
}
