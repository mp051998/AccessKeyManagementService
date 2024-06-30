import { AdminAccessKeysModule } from './admin-access-keys/admin-access-keys.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongoModelsModule } from './shared/models/mongo/mongo-models.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@liaoliaots/nestjs-redis';
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
export class AppModule { }
