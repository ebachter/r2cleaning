import pino, {LoggerOptions} from 'pino';
import {lambdaRequestTracker, pinoLambdaDestination} from 'pino-lambda';

const options: LoggerOptions = {
  name: process.title,
  level: process.env.LOG_LEVEL,
  /* hooks: {
    logMethod(inputArgs: any, method) {
      // console.log('type of 1st', typeof inputArgs[0]);
      let params;
      if (['string', 'number'].includes(typeof inputArgs[0])) {
        if (inputArgs.length > 1) {
          params = inputArgs
            .slice(1)
            .map((e: any) => e)
            .join(', ');
          inputArgs[0] = `${inputArgs[0]}, ${params}`;
        }
      }
      return method.apply(this, inputArgs);
    },
  }, */
};

if (process.env.NODE_ENV === 'development')
  options.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      ignore: 'pid,hostname,name',
      translateTime: 'yyyy-dd-mm, h:MM:ss TT',
    },
  };

const withRequest = lambdaRequestTracker();

const log = process.env.AWS_LAMBDA_FUNCTION_NAME
  ? pino(options, pinoLambdaDestination())
  : pino(options);

export {log as default, withRequest as pinoWithRequest};
