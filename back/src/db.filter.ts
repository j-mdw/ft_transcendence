import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = 404;

    response.status(status).json({
      statusCode: '404',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
