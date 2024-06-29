import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { AccessKey } from 'src/models/access-key.model';
import { AccessKeyService } from 'src/models/mongo/access-key/access-key.service';
import { v4 as uuidv4 } from 'uuid'; // For generating unique keys

@Injectable()
export class AccessKeyManagementService {

  private accessKeySvc: AccessKeyService;

  constructor(accessKeySvc: AccessKeyService) {
    this.accessKeySvc = accessKeySvc;
  }

  async generateKey(rateLimiitPerMin: number, expireAt: Date): Promise<AccessKey> {
    const newKey: AccessKey = {
      key: uuidv4(),
      rateLimitPerMin: rateLimiitPerMin,
      expireAt
    };

    await this.accessKeySvc.createAccessKey(newKey.key, newKey.rateLimitPerMin, newKey.expireAt);

    return newKey;
  }

  async getKey(key: string): Promise<AccessKey> {
    const response = await this.accessKeySvc.getAccessKeyByKey(key);
    if (!response) {
      throw new NotFoundException('Access key not found');
    }
    return response;
  }

  // Method to get all the active keys
  async getActiveKeys(): Promise<Array<AccessKey>> {
    return await this.accessKeySvc.getAllActiveAccessKeys();
  }

  async useKey(key: string): Promise<AccessKey> {
    // Retrieve the rate limit for the key
    const accessKeyData = await this.accessKeySvc.getAccessKeyByKey(key);
    if (!accessKeyData) {
      throw new NotFoundException('Access key not found');
    }
    // Check if the key has expired
    const { expireAt, rateLimitPerMin } = accessKeyData;
    if (new Date(expireAt) < new Date()) {
      throw new UnauthorizedException('Access key has expired');
    }

    // Check the rate limit for the key
    const accessKeyRateLimitUsage = accessKeyData?.rateLimitUsage;
    if (!accessKeyRateLimitUsage) {
      // If the rate limit usage is not set, set it to the current minute
      accessKeyData.rateLimitUsage = {
        start: new Date(),
        end: new Date(new Date().getTime() + 60000),
        count: 1
      }
      accessKeyData.markModified('rateLimitUsage');
    } else {
      // If the rate limit usage is set, check if the current minute is the same as the stored minute
      if (new Date() < new Date(accessKeyRateLimitUsage.start) || new Date() > new Date(accessKeyRateLimitUsage.end)) {
        // If the current minute is different, reset the rate limit usage
        accessKeyData.rateLimitUsage = {
          start: new Date(),
          end: new Date(new Date().getTime() + 60000), // Adds 1 minute to the current time
          count: 1
        }
        accessKeyData.markModified('rateLimitUsage');
      } else {
        // If the current minute is the same and the limit has been reached, throw an error
        if (accessKeyRateLimitUsage.count >= rateLimitPerMin) {
          throw new HttpException({
            message: 'Rate limit exceeded. Please try again later.',
            data: accessKeyData
          }
            , HttpStatus.TOO_MANY_REQUESTS);
        } else {
          accessKeyData.rateLimitUsage.count += 1;
          accessKeyData.markModified('rateLimitUsage');
        }
      }
    }

    await accessKeyData.save();
    return accessKeyData;
  }
}
