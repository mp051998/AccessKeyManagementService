import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: Move port to a .env file
  await app.listen(3000);
}
bootstrap();
