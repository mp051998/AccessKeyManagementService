import { AdminAccessKeysController } from './admin-access-keys.controller';
import { AdminAccessKeysService } from './admin-access-keys.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AdminAccessKeysController],
  providers: [AdminAccessKeysService]
})
export class AdminAccessKeysModule { }
