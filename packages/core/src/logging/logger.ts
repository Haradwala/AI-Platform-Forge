import pino, { Logger as PinoLogger } from 'pino';
import { ILogger } from './interface';

export class Logger implements ILogger {
  private pinoLogger: PinoLogger;

  constructor(pinoLogger?: PinoLogger) {
    this.pinoLogger = pinoLogger || pino({
      level: process.env.LOG_LEVEL || 'info'
    });
  }

  debug(message: string, context?: Record<string, any>): void {
    if (context) {
      this.pinoLogger.debug(context, message);
    } else {
      this.pinoLogger.debug(message);
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (context) {
      this.pinoLogger.info(context, message);
    } else {
      this.pinoLogger.info(message);
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (context) {
      this.pinoLogger.warn(context, message);
    } else {
      this.pinoLogger.warn(message);
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    const logData: Record<string, any> = { ...context };
    if (error) {
      logData.err = {
        message: error.message,
        stack: error.stack,
        name: error.name
      };
    }
    this.pinoLogger.error(logData, message);
  }

  child(bindings: Record<string, any>): ILogger {
    return new Logger(this.pinoLogger.child(bindings));
  }
}
