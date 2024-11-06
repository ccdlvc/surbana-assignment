import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ResponseDto } from '../dtos/location.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messageObj =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const message =
      exception instanceof HttpException
        ? exception.getResponse().toString()
        : 'Internal server error';

    this.logger.error(
      `HTTP Status: ${status} Error Message: ${JSON.stringify(messageObj)}`,
      exception instanceof Error ? exception.stack : '',
    );

    const errorResponse: ResponseDto<null> = {
      errorCode: status,
      errorMessage: message,
      data: null,
    };

    response.status(status).json(errorResponse);
  }
}
