import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { AdminAccessKeysService } from './admin-access-keys.service';

@Controller('admin/access-keys')
export class AdminAccessKeysController {

  constructor(private readonly adminAccessKeysSvc: AdminAccessKeysService) { }

  // Endpoint to get all the active access keys
  @Get('/')
  async getActiveKeys() {
    return await this.adminAccessKeysSvc.getActiveKeys();
  }

  // Endpoint to get a specific access key by key
  @Get('/:key')
  async getKey(@Param('key') key: string) {
    return await this.adminAccessKeysSvc.getKey(key);
  }

  // Endpoint to generate a new access key
  @Post('/')
  async generateKey(@Body() { expireAfterMins, rateLimitPerMin }: { expireAfterMins: number; rateLimitPerMin: number }) {
    const expireAfterMilliSeconds = expireAfterMins * 60 * 1000;
    const expiryTime = new Date(Date.now() + parseInt(expireAfterMilliSeconds.toString()));
    return await this.adminAccessKeysSvc.generateKey(rateLimitPerMin, expiryTime);
  }

  @Patch('/')
  async updateKey(@Body() { key, rateLimitPerMin, expireAt }: { key: string; rateLimitPerMin?: number; expireAt?: Date }) {
    const accessKeyData = await this.adminAccessKeysSvc.getKey(key);
    if (!accessKeyData) {
      throw new BadRequestException('Access key not found');
    }

    // If neither rateLimitPerMin nor expireAt is provided, return an error
    if (!rateLimitPerMin && !expireAt) {
      throw new BadRequestException('Please provide at least one of rateLimitPerMin or expireAt');
    }
    if (!rateLimitPerMin) {
      rateLimitPerMin = accessKeyData.rateLimitPerMin;
    }
    if (!expireAt) {
      expireAt = accessKeyData.expireAt;
    }
    return await this.adminAccessKeysSvc.updateKey(key, rateLimitPerMin, expireAt);
  }

  @Delete('/:key')
  async deleteKey(@Param('key') key: string) {
    return await this.adminAccessKeysSvc.deleteKey(key);
  }


  // // TODO: Since the token service will be using redis pub-sub to cache valid tokens and maintain rate limits,
  // //  we probably don't need this here. Should've read the requirements properly and made the microservices on by one :)
  // @Put('/')
  // async useKey(@Body('key') key: string) {
  //   const response = await this.accessKeyManagementService.useKey(key);
  //   return response;
  // }

}
