import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.enableCors({ origin: true, credentials: true });

  const config = app.get(ConfigService);
  const port = config.get<number>('port', 3000);

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API running on port ${port}`);
}

bootstrap();
