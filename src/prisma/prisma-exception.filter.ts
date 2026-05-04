import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/client';
import type { Response } from 'express';

const PRISMA_CODE_STATUS: Record<string, number> = {
  P2000: HttpStatus.BAD_REQUEST,
  P2001: HttpStatus.NOT_FOUND,
  P2002: HttpStatus.CONFLICT,
  P2003: HttpStatus.BAD_REQUEST,
  P2014: HttpStatus.BAD_REQUEST,
  P2025: HttpStatus.NOT_FOUND,
};

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(
    exception:
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const { statusCode, message, error } = this.mapException(exception);
    this.logger.error(`Prisma error [${error}]: ${message}`, exception.stack);
    response.status(statusCode).json({ statusCode, message, error });
  }

  private mapException(
    exception:
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientValidationError,
  ): { statusCode: number; message: string; error: string } {
    if (exception instanceof PrismaClientKnownRequestError) {
      return {
        statusCode: PRISMA_CODE_STATUS[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.code,
      };
    }

    if (exception instanceof PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        error: 'Validation Error',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      error: 'Internal Server Error',
    };
  }
}
