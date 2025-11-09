import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { enableBigIntJsonSerialization } from './utils/bigint-serializer';

async function bootstrap() {
  enableBigIntJsonSerialization();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://scabbily-watery-cindie.ngrok-free.dev',
      'https://fervidly-unshort-stanton.ngrok-free.dev',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
