import { Controller, Get, Param } from '@nestjs/common';
import { UserAccessKeysService } from './user-access-keys.service';

@Controller('user/access-keys')
export class UserAccessKeysController {
  constructor(
    private readonly userAccessKeysSvc: UserAccessKeysService
  ) { }

  @Get(':key')
  getKey(@Param('key') key: string) {
    return this.userAccessKeysSvc.getKey(key);
  }
}
