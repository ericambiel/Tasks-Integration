import cors, { CorsOptions } from 'cors';

import { Request } from 'express';
import ConsoleLog from '@libs/ConsoleLog';
import { api as _api, cors as _cors } from '../../config';

// const debug = new ConsoleLog('debug', 'cors');

const corsOptionsDelegate = (req: Request, callback: any): void => {
  const corsConfig = _cors();
  const apiConfig = _api();

  let corsOptions: CorsOptions;
  switch (true) {
    case corsConfig.ORIGINS.indexOf('*') !== -1:
      corsOptions = {
        origin: '*',
        // methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        // allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'X-Request-Width'],
        credentials: true,
        optionsSuccessStatus: corsConfig.SUCCESS_CODE,
      }; // Allow all request origins
      ConsoleLog.print(
        `Reflect all Origin - Request Origin: ${req.header('Origin')}`,
        'info',
        'cors',
        apiConfig.SILENT_MODE,
      );
      break;
    case corsConfig.ORIGINS.indexOf(req.header('Origin') ?? '') !== -1:
      corsOptions = {
        origin: true,
        // methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
        // allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'X-Request-Width'],
        credentials: true,
        optionsSuccessStatus: corsConfig.SUCCESS_CODE,
      }; // reflect (enable) the requested origin in the CORS response
      ConsoleLog.print(
        `Reflect - Request Origin: ${req.header('Origin')}`,
        'info',
        'cors',
        apiConfig.SILENT_MODE,
      );
      break;
    default: // disable CORS for this request
      corsOptions = {
        origin: false,
        optionsSuccessStatus: corsConfig.SUCCESS_CODE,
      };
      ConsoleLog.print(
        `Browser cold reject Cors. Configured ${
          corsConfig.ORIGINS
        } - Request Origin: ${req.header('Origin')}`,
        'info',
        'cors',
        apiConfig.SILENT_MODE,
      );
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default cors(corsOptionsDelegate);
