import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
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

  @Patch(':key')
  toggleKey(@Param('key') key: string, @Body() { active }: { active: boolean }) {
    if (active) {
      return this.userAccessKeysSvc.activateKey(key);
    }
    return this.userAccessKeysSvc.deactivateKey(key);
  }
}
