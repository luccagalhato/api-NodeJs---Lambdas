import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import AppException from './app.exception';

@Catch(AppException)
export class HandlerException implements ExceptionFilter {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getCode()).json({
      statusCode: exception.getCode(),
      error: exception.message,
    });
  }
}
