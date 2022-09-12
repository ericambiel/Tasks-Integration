import express from 'express';

import { inject, singleton } from 'tsyringe';
import ConsoleLog from '@libs/ConsoleLog';
import api from '../config/api';
import cors from './middlewares/cors';
import success from './middlewares/success';
import notFound from './middlewares/notFound';
import error from './middlewares/error';

@singleton()
export default class App {
  public readonly server: express.Express;

  protected readonly apiConfig = api();

  constructor(
    @inject('router')
    public readonly router: express.Router,
  ) {
    this.server = express();
    this.setup();
  }

  setup(): void {
    try {
      ConsoleLog.print(
        'Registering API...',
        'info',
        'API',
        this.apiConfig.SILENT,
      );

      this.middlewareBeforeRoutes();
      this.routes();
      this.middlewareAfterRoutes();

      ConsoleLog.print(
        'API has been registered.',
        'info',
        'API',
        this.apiConfig.SILENT,
      );
    } catch (err: any) {
      ConsoleLog.print(
        `An exception was thrown during API registration: ${
          (<Error>err).message
        }`,
        'error',
        'API',
        this.apiConfig.SILENT,
      );
      throw err;
    }
  }

  protected middlewareBeforeRoutes(): void {
    ConsoleLog.print(
      'Starting Middlewares for routes...',
      'debug',
      'API',
      this.apiConfig.SILENT,
    );

    this.server.use(cors);
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    // Normalize response for response
    this.server.use(success);
  }

  protected routes(): void {
    ConsoleLog.print(
      'Starting Routes...',
      'debug',
      'API',
      this.apiConfig.SILENT,
    );
    // Initiate routes and set base URL
    this.server.use(this.apiConfig.BASE_URL, this.router);

    if (this.apiConfig.DEBUG_LEVEL.includes('ROUTES')) {
      import('@helpers/printRoutes').then(m => {
        m.default(this.apiConfig.BASE_URL, this.router).then();
      });
    }
  }

  protected middlewareAfterRoutes(): void {
    ConsoleLog.print(
      'Starting remaining middleware...',
      'debug',
      'API',
      this.apiConfig.SILENT,
    );
    // Route not found Handler
    this.server.use(notFound);
    // error handler
    this.server.use(error);
  }
}
