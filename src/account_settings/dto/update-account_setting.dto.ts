import { PartialType } from '@nestjs/swagger';
import { CreateAccountSettingDto } from './create-account_setting.dto';

export class UpdateAccountSettingDto extends PartialType(CreateAccountSettingDto) {}
