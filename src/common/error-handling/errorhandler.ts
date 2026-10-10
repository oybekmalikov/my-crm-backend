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

    // Always log the full error server-side for debugging.
    if (!(exception instanceof HttpException)) {
      console.error(exception);
    }

    // Never leak internal error details (stack traces, raw exception
    // objects, driver error messages) to API clients for unhandled/5xx
    // errors — only HttpExceptions raised deliberately by application code
    // carry a client-safe message.
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'INTERNAL_SERVER_ERROR' };

    response.status(status).json({
      statusCode: this.customStatus || status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: this.customMessage || message,
    });
  }
}
