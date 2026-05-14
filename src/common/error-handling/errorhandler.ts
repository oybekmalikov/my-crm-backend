import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class ErrorHandler implements ExceptionFilter {
  private readonly customMessage: string | undefined;
  private readonly customStatus: number | undefined;
  constructor(customStatus?: number, customMessage?: string) {
    this.customMessage = customMessage || undefined;
    this.customStatus = customStatus || undefined;
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    response.status(status).json({
      statusCode: this.customStatus || status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.customMessage || message,
    });
  }
}
