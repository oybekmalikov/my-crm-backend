import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import express from 'express'
import helmet from 'helmet'
import { join } from 'path'
import { AppModule } from './app.module'
import { setupSwagger } from './common/config/swagger.config'
import { ErrorHandler } from './common/error-handling/errorhandler'
import { sanitizeRequestData } from './common/middleware/mongo-sanitize.middleware'

function parseCorsOrigins(raw: string | undefined): string[] | boolean {
  if (!raw || raw.trim() === '') {
    return true;
  }
  return raw.split(',').map((origin) => origin.trim());
}

export async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    const HOST = process.env.HOST || '0.0.0.0';
    const app = await NestFactory.create(AppModule);
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.use(sanitizeRequestData);
    app.use('/assets', express.static(join(__dirname, '..', 'assets')));
    app.enableCors({
      origin: parseCorsOrigins(process.env.CORS_ORIGINS),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    setupSwagger(app);
    app.useGlobalFilters(new ErrorHandler());
    await app.listen(PORT, () => {
      console.log(`Server started on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
