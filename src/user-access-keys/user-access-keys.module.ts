import { Module } from '@nestjs/common';
import { UserAccessKeysService } from './user-access-keys.service';
import { UserAccessKeysController } from './user-access-keys.controller';

@Module({
  providers: [UserAccessKeysService],
  controllers: [UserAccessKeysController]
})
export class UserAccessKeysModule {}
