import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { Redis as RedisClient } from 'ioredis';

@Injectable()
export class UserAccessKeysService {

  private accessKeyMongoSvc: AccessKeyMongoService;
  private publisher: RedisClient;

  constructor(
    accessKeyMongoSvc: AccessKeyMongoService,
  ) {
    this.accessKeyMongoSvc = accessKeyMongoSvc;
    this.publisher = new RedisClient();
  }

  async getKey(key: string) {
    const accessKeyData = await this.accessKeyMongoSvc.getAccessKey(key);
    if (!accessKeyData) {
      throw new NotFoundException('Access key not found');
    }
    return accessKeyData;
  }

  async activateKey(key: string) {
    const accessKeyData = await this.accessKeyMongoSvc.getAccessKey(key);
    if (!accessKeyData) {
      throw new NotFoundException('Access key not found');
    }
    if (accessKeyData.active) {
      throw new BadRequestException('Access key already active');
    }
    accessKeyData.active = true;
    await accessKeyData.save();
    this.publisher.publish(process.env.REDIS_PUBSUB_CHANNEL, JSON.stringify(accessKeyData));
    return accessKeyData;
  }

  async deactivateKey(key: string) {
    const accessKeyData = await this.accessKeyMongoSvc.getAccessKey(key);
    if (!accessKeyData) {
      throw new NotFoundException('Access key not found');
    }
    if (!accessKeyData.active) {
      throw new BadRequestException('Access key already deactivated');
    }
    accessKeyData.active = false;
    await accessKeyData.save();
    this.publisher.publish(process.env.REDIS_PUBSUB_CHANNEL, JSON.stringify(accessKeyData));
    return accessKeyData;
  }
}
