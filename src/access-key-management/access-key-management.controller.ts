import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { AccessKeyManagementService } from './access-key-management.service';

@Controller('access-key-management')
export class AccessKeyManagementController {

  constructor(private readonly accessKeyManagementService: AccessKeyManagementService) { }

  // Endpoint to get all the active access keys
  @Get('/')
  async getActiveKeys() {
    return await this.accessKeyManagementService.getActiveKeysWithTTL();
  }

  // Endpoint to get a specific access key by key
  @Get('/:key')
  async getKey(@Param('key') key: string) {
    console.log("Key:", key);
    return await this.accessKeyManagementService.getKey(key);
  }

  // Endpoint to generate a new access key
  @Post('/')
  async generateKey(@Body() { expireAfterMins, rateLimitPerMin }: { expireAfterMins: number; rateLimitPerMin: number }) {
    // Expiry will be the number of days
    // TODO: Accept body and use that to generate the key
    // Let the expiry be 5 mins => 300 seconds => 300000 milliseconds
    // const expiryTime = new Date(Date.now() + 300000);
    // console.log('Expiry time:', expiryTime);
    console.log("Expire After Mins:", expireAfterMins);
    const expireAfterMilliSeconds = expireAfterMins * 60 * 1000;
    const expiryTime = new Date(Date.now() + parseInt(expireAfterMilliSeconds.toString()));
    console.log("Expire after milliseconds: ", expireAfterMilliSeconds);
    console.log("Rate Limit Per Min:", rateLimitPerMin);
    return await this.accessKeyManagementService.generateKey(rateLimitPerMin, expiryTime);
  }

  @Put('/')
  async useKey(@Body('key') key: string) {
    const response = await this.accessKeyManagementService.useKey(key);
    // If limit has exceeded, return the response with Too Many Requests status code
    if (response.limitExceeded) {
      throw new HttpException({
        message: 'Rate limit exceeded. Please try again later.',
        data: response
      }
        , HttpStatus.TOO_MANY_REQUESTS);
    }
    return response;
  }

}
