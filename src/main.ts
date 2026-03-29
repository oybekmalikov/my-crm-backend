import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ErrorHandler } from "./common/error-handling/errorhandler";
export async function start() {
  try {
    const PORT = process.env.PORT || 3030;
    const HOST = process.env.HOST || 'localhost';
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.use('/assets', express.static(join(__dirname, '..', 'assets')));
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: false,
    });
    const config = new DocumentBuilder()
      .setTitle('MyCRM Project')
      .setDescription('MyCRM REST API')
      .setVersion('1.0')
      .addTag('Nest JS', 'Swagger')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    app.useGlobalFilters(new ErrorHandler());
    await app.listen(PORT, () => {
      console.log(`Server started on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
