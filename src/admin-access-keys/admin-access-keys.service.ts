import { Injectable, NotFoundException } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

import { AccessKey } from 'src/shared/schemas/mongo/access-key.schema';
import { AccessKeyMongoService } from 'src/shared/models/mongo/access-key/access-key.service';
import { v4 as uuidv4 } from 'uuid'; // For generating unique keys

@Injectable()
export class AdminAccessKeysService {

  private accessKeyMongoSvc: AccessKeyMongoService;
  private publisher: RedisClient;
  private channel: string;

  constructor(
    accessKeyMongoSvc: AccessKeyMongoService
  ) {
    this.accessKeyMongoSvc = accessKeyMongoSvc;
    this.publisher = new Redis();
    this.channel = process.env.REDIS_PUBSUB_CHANNEL;
  }

  private async publish(message: string): Promise<void> {
    await this.publisher.publish(this.channel, message);
  }

  async generateKey(rateLimitPerMin: number, expireAt: Date): Promise<AccessKey> {
    const newKey: AccessKey = {
      key: uuidv4(),
      rateLimitPerMin,
      expireAt
    };

    const accessKeyData = await this.accessKeyMongoSvc.createAccessKey(newKey.key, newKey.rateLimitPerMin, newKey.expireAt);
    await this.publish(JSON.stringify(accessKeyData));

    return accessKeyData;
  }

  async getKey(key: string): Promise<AccessKey> {
    const response = await this.accessKeyMongoSvc.getAccessKey(key);
    if (!response) {
      throw new NotFoundException('Access key not found');
    }
    return response;
  }

  // Method to get all the active keys
  async getActiveKeys(): Promise<Array<AccessKey>> {
    return await this.accessKeyMongoSvc.getAllActiveAccessKeys();
  }

  async updateKey(key: string, rateLimitPerMin: number = null, expireAt: Date = null): Promise<AccessKey> {
    const response = await this.accessKeyMongoSvc.updateAccessKey(key, rateLimitPerMin, expireAt);
    console.log("Response: ", response);
    await this.publish(JSON.stringify(response));
    return response;
  }

  async deleteKey(key: string): Promise<AccessKey> {
    const accessKeyData = await this.accessKeyMongoSvc.getAccessKey(key);
    const response = await this.accessKeyMongoSvc.deleteAccessKey(key);
    accessKeyData.expireAt = new Date();
    // Since the redis pubsub expires whenever the expireAt has reached, we can just publish the key with an expired date
    await this.publish(JSON.stringify(accessKeyData));
    return response;
  }

  // async useKey(key: string): Promise<AccessKey> {
  //   // Retrieve the rate limit for the key
  //   const accessKeyData = await this.accessKeySvc.getAccessKeyByKey(key);
  //   if (!accessKeyData) {
  //     throw new NotFoundException('Access key not found');
  //   }
  //   // Check if the key has expired
  //   const { expireAt, rateLimitPerMin } = accessKeyData;
  //   if (new Date(expireAt) < new Date()) {
  //     throw new UnauthorizedException('Access key has expired');
  //   }

  //   // Check the rate limit for the key
  //   const accessKeyRateLimitUsage = accessKeyData?.rateLimitUsage;
  //   if (!accessKeyRateLimitUsage) {
  //     // If the rate limit usage is not set, set it to the current minute
  //     accessKeyData.rateLimitUsage = {
  //       start: new Date(),
  //       end: new Date(new Date().getTime() + 60000),
  //       count: 1
  //     }
  //     accessKeyData.markModified('rateLimitUsage');
  //   } else {
  //     // If the rate limit usage is set, check if the current minute is the same as the stored minute
  //     if (new Date() < new Date(accessKeyRateLimitUsage.start) || new Date() > new Date(accessKeyRateLimitUsage.end)) {
  //       // If the current minute is different, reset the rate limit usage
  //       accessKeyData.rateLimitUsage = {
  //         start: new Date(),
  //         end: new Date(new Date().getTime() + 60000), // Adds 1 minute to the current time
  //         count: 1
  //       }
  //       accessKeyData.markModified('rateLimitUsage');
  //     } else {
  //       // If the current minute is the same and the limit has been reached, throw an error
  //       if (accessKeyRateLimitUsage.count >= rateLimitPerMin) {
  //         throw new HttpException({
  //           message: 'Rate limit exceeded. Please try again later.',
  //           data: accessKeyData
  //         }
  //           , HttpStatus.TOO_MANY_REQUESTS);
  //       } else {
  //         accessKeyData.rateLimitUsage.count += 1;
  //         accessKeyData.markModified('rateLimitUsage');
  //       }
  //     }
  //   }

  //   await accessKeyData.save();
  //   this.publish(JSON.stringify(accessKeyData));
  //   return accessKeyData;
  // }
}
