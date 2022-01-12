import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DatabaseExceptionFilter } from './db.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipNullProperties: false,
    }),
  );
  app.enableCors({ credentials: true, origin: 'http://localhost' });
  app.use(cookieParser());
  app.useGlobalFilters(new DatabaseExceptionFilter());
  await app.listen(4000);
}
bootstrap();
