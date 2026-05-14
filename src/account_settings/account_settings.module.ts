import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSettingsService } from './account_settings.service';
import { AccountSettingsController } from './account_settings.controller';
import { AccountSetting, AccountSettingSchema } from './entities/account_setting.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountSetting.name, schema: AccountSettingSchema },
    ]),
  ],
  controllers: [AccountSettingsController],
  providers: [AccountSettingsService],
  exports: [AccountSettingsService],
})
export class AccountSettingsModule {}
