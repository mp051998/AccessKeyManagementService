import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { AccessKey } from 'src/models/access-key.model';
import { AccessKeyUseResponse } from 'src/models/access-key-use-response.model';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid'; // For generating unique keys

@Injectable()
export class AccessKeyManagementService {

  private redisClient: Redis;

  constructor(redisSvc: RedisService) {
    this.redisClient = redisSvc.getClient();
  }

  async generateKey(rateLimitPerMin: number, expireAt: Date): Promise<AccessKey> {
    const newKey: AccessKey = {
      key: uuidv4(),
      rateLimitPerMin,
      expireAt
    };

    // Commenting this out as we will want to keep track of expired keys as well and return a different error response
    // If that is not required, then we can have redis automatically expire the key

    /*
    const expirationInSeconds = Math.floor((expireAt.getTime() - Date.now()) / 1000);
    console.log("Expiration in seconds:", expirationInSeconds);
    */

    // Save the key to the redis database
    // await this.redisClient.setex(`accessKey:${newKey.key}`, expirationInSeconds, JSON.stringify(newKey));
    await this.redisClient.set(`accessKey:${newKey.key}`, JSON.stringify(newKey));

    return newKey;
  }

  async getKey(key: string): Promise<AccessKey> {
    const keyData = await this.redisClient.get(`accessKey:${key}`);
    // Also calculate and return the TTL for the key
    const { expireAt } = JSON.parse(keyData);
    const ttl = Math.max(Math.floor((new Date(expireAt).getTime() - Date.now()) / 1000), 0);
    const keyDataWithTTL = { ...JSON.parse(keyData), ttl };
    console.log("Updated Key Data:", keyDataWithTTL);
    return keyDataWithTTL;
  }

  // Method to get all the active keys along with their TTL
  // async getActiveKeysWithTTL(): Promise<Array<{ keyData: AccessKey; ttl: number }>> {
  async getActiveKeysWithTTL(): Promise<Array<AccessKey>> {
    const keys = await this.redisClient.keys('accessKey:*');
    if (keys.length === 0) {
      return [];
    }
    const keyDataPromises = keys.map(key => this.redisClient.get(key));
    // const ttlPromises = keys.map(key => this.redisClient.ttl(key));

    const keyDataResults = await Promise.all(keyDataPromises);
    // const ttlResults = await Promise.all(ttlPromises);

    /*
    // Calculate the api key's validaty in seconds
    keyDataResults.map((keyData) => {
      const { expireAt } = JSON.parse(keyData);
      const ttl = Math.max(Math.floor((new Date(expireAt).getTime() - Date.now()) / 1000), 0);
      const updatedKeyData = { ...JSON.parse(keyData), ttl };
      console.log("Updated Key Data:", updatedKeyData);
      return JSON.stringify(updatedKeyData);
    });

    return keyDataResults.map((keyData) => JSON.parse(keyData));
    */

    // Calculate the api key's validity in seconds and update the key data to include the ttl
    const updatedKeyDataResults = keyDataResults.map((keyData) => {
      const parsedKeyData = JSON.parse(keyData);
      const { expireAt } = parsedKeyData;
      const ttl = Math.max(Math.floor((new Date(expireAt).getTime() - Date.now()) / 1000), 0);
      return { ...parsedKeyData, ttl }; // Include the ttl in the returned object
    });

    return updatedKeyDataResults; // Return the updated key data with ttl

    // return keyDataResults.map((keyData) => (
    //   keyData: JSON.parse(keyData),
    //   // ttl: ttlResults[index],
    // ));
  }

  async useKey(key: string): Promise<AccessKeyUseResponse> {
    // Key for tracking rate limit usage
    const rateLimitKey = `rateLimit:${key}`;

    // Get the current count for the key
    const currentCount = await this.redisClient.get(rateLimitKey);

    // Retrieve the rate limit for the key
    const accessKeyData = await this.getKey(key);
    if (!accessKeyData) {
      // throw new Error('Access key not found');
      throw new NotFoundException('Access key not found');
    }
    // Check if the key has expired
    const { expireAt, rateLimitPerMin } = accessKeyData;
    if (new Date(expireAt) < new Date()) {
      // throw new Error('Access key has expired');
      throw new UnauthorizedException('Access key has expired');
    }

    if (currentCount === null) {
      // If the key hasn't been used this minute, set the counter to 1 and set expiration
      await this.redisClient.set(rateLimitKey, 1, 'EX', 60); // EX 60 sets the key to expire in 60 seconds
      const rateLimitData = await this.redisClient.get(rateLimitKey);
      const rateLimitRefreshInSeconds = await this.redisClient.ttl(rateLimitKey);
      return {
        accessKeyData,
        rateLimitData: JSON.parse(rateLimitData),
        rateLimitRefreshInSeconds,
        limitExceeded: false
      }
    } else if (parseInt(currentCount) < rateLimitPerMin) {
      // If the current count is less than the rate limit, increment the counter
      await this.redisClient.incr(rateLimitKey);
      const rateLimitData = await this.redisClient.get(rateLimitKey);
      const rateLimitRefreshInSeconds = await this.redisClient.ttl(rateLimitKey);
      return {
        accessKeyData,
        rateLimitData: JSON.parse(rateLimitData),
        rateLimitRefreshInSeconds,
        limitExceeded: false
      }
    } else {
      // Rate limit exceeded
      console.log("Rate limit exceeded");
      const rateLimitRefreshInSeconds = await this.redisClient.ttl(rateLimitKey);
      return {
        accessKeyData,
        rateLimitData: null,
        rateLimitRefreshInSeconds,
        limitExceeded: true
      }
    }
  }
}
