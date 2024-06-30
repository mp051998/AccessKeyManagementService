import { Module, OnModuleInit } from '@nestjs/common';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';

import { AdminAccessKeysModule } from './admin-access-keys/admin-access-keys.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongoModelsModule } from './shared/models/mongo/mongo-models.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAccessKeysModule } from './user-access-keys/user-access-keys.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env'
      }
    ),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      }
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING, {}),
    MongoModelsModule,
    AdminAccessKeysModule,
    UserAccessKeysModule
  ],
  controllers: [AppController],
  providers: [AppService],
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
