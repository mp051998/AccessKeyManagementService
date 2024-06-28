import { Module, OnModuleInit } from '@nestjs/common';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';

import { AccessKeyManagementController } from './access-key-management/access-key-management.controller';
import { AccessKeyManagementService } from './access-key-management/access-key-management.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // TODO: Move the host and port to a .env file
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379
      }
    })
  ],
  controllers: [AppController, AccessKeyManagementController],
  providers: [AppService, AccessKeyManagementService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly redisSvc: RedisService) {
  }

  async onModuleInit() {
    this.redisSvc.getClient().ping().then((response: any) => {
      console.log('Redis is connected');
      console.log("response", response);
    });
  }
}
