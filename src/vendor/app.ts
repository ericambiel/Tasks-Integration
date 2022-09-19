import 'reflect-metadata';
import * as http from 'http';

import { container } from 'tsyringe';
import { api } from '@configs/*';

import { Router } from 'express';
import ExpressServer from './http/ExpressServer';
import onError from './http/events/onStartError';
import onStarted from './http/events/onStarted';

/**
 * Set up an App.
 * @param {Router} router The routes on the API.
 // * @param {string} [envPath] The path to the environment file (.env)
 */
export default async (
  router: Router,
  // envPath?: string,
): Promise<http.Server> => {
  // Load environment configuration
  // dotEnvSafe.config({
  //   path: envPath,
  //   allowEmptyValues: true,
  // });

  const expressServer = container.resolve(ExpressServer);

  container.registerInstance('Router', router);

  const server = http.createServer(expressServer.server);

  // Set up the server port
  const apiConfig = api();
  const { PORT } = apiConfig;
  expressServer.server.set('Port', PORT);
  server.listen(PORT);

  // Register event listeners
  server.on('error', onError);
  server.on('listening', onStarted);

  return server;
};
