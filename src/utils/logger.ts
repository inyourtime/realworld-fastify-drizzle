import { PinoLoggerOptions } from 'fastify/types/logger';

type LoggerOption = boolean | PinoLoggerOptions;

interface EnvToLogger {
  [key: string]: LoggerOption;
}

export const envToLogger: EnvToLogger = {
  development: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          remoteAddress: request.ip,
        };
      },
      err(error) {
        return {
          type: error.constructor.name,
          message: error.message,
        };
      },
    },
  },
  production: true,
  test: false,
};
