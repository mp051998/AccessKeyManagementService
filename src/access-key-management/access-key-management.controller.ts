import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { AccessKeyManagementService } from './access-key-management.service';

@Controller('access-key-management')
export class AccessKeyManagementController {

  constructor(private readonly accessKeyManagementService: AccessKeyManagementService) { }

  // Endpoint to get all the active access keys
  @Get('/')
  async getActiveKeys() {
    return await this.accessKeyManagementService.getActiveKeys();
  }

  // Endpoint to get a specific access key by key
  @Get('/:key')
  async getKey(@Param('key') key: string) {
    return await this.accessKeyManagementService.getKey(key);
  }

  // Endpoint to generate a new access key
  @Post('/')
  async generateKey(@Body() { expireAfterMins, rateLimitPerMin }: { expireAfterMins: number; rateLimitPerMin: number }) {
    const expireAfterMilliSeconds = expireAfterMins * 60 * 1000;
    const expiryTime = new Date(Date.now() + parseInt(expireAfterMilliSeconds.toString()));
    return await this.accessKeyManagementService.generateKey(rateLimitPerMin, expiryTime);
  }

  @Put('/')
  async useKey(@Body('key') key: string) {
    const response = await this.accessKeyManagementService.useKey(key);
    return response;
  }

}
