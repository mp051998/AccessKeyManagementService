import { Module } from '@nestjs/common';
import { UserAccessKeysController } from './user-access-keys.controller';
import { UserAccessKeysService } from './user-access-keys.service';

@Module({
  providers: [UserAccessKeysService],
  controllers: [UserAccessKeysController]
})

export class UserAccessKeysModule { }

