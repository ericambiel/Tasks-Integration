import 'reflect-metadata';
import { config } from 'dotenv-safe';
// import routes from '@shared/infra/http/routes';

import ConsoleLog from '@libs/ConsoleLog';
import { container } from 'tsyringe';
import { IGoogleUserRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import googleApi from '@config/googleApi';
import { IGoogleClientRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleClientRepository';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import RegisterNewConnectionsService from '@modules/integration/services/RegisterNewConnectionsService';
import CronSchedulerFacade from '@shared/facades/CronSchedulerFacade';
import IntegrationController from '@modules/integration/infra/http/controller/IntegrationController';
// import startExpressServer from './vendor/app';

// Load Environments from .env
config({ allowEmptyValues: true });

ConsoleLog.print('Starting server...', 'info', 'SERVER');

async function startFluigModule() {
  await container.resolve(RegisterNewConnectionsService).execute();
}

async function startGoogleModule() {
  const googleApiConfig = googleApi();

  // TODO: Leave all this to controller
  container.register<string>('clientCredentialFilePath', {
    useValue: googleApiConfig.CLIENTS_PATH,
  });

  container.register<string>('tokensPath', {
    useValue: googleApiConfig.TOKENS_PATH,
  });

  const repositoryClient = container.resolve<IGoogleClientRepository>(
    GoogleClientRepository,
  );

  const repositoryUser =
    container.resolve<IGoogleUserRepository>(GoogleUserRepository);

  const events: Promise<void>[] = [];

  events.push(
    new Promise(resolve => {
      repositoryClient.once('loadedClientsCredentialFiles', () => resolve());
    }),
  );

  events.push(
    new Promise(resolve => {
      repositoryUser.once('loadedUsersTokenFiles', () => resolve());
    }),
  );

  //  Waiting for all needed events
  await Promise.all(events);

  // const serviceAuth = container.resolve(AuthorizeUserToClientGoogleServer);
  // const usersToken = repositoryUser.list();
  // const {
  //   web: { client_id: clientId },
  // } = repositoryClient.list()[0]; // Get first Google Client
  //
  // // Authorize all Google users to specific client
  // await Promise.all(
  //   usersToken.map(userToken => serviceAuth.execute({ userToken, clientId })),
  // );
}

async function startIntegrationModule() {
  const cronScheduler = container.resolve(CronSchedulerFacade);
  const integratorController = container.resolve(IntegrationController);
  const connections = await integratorController.listAllConnections();

  // TODO: Need to test, STOP HERE
  connections.forEach(conn => {
    cronScheduler.jobMaker(integratorController.sendWorkflowFluig, {
      code: conn.connId,
    });
  });
}

export default async function main() {
  await startGoogleModule();
  await startFluigModule();
  await startIntegrationModule();

  // startExpressServer(routes)
  //   .then(() => {
  //     ConsoleLog.print('Express Server was started', 'info', 'SERVER');
  //   })
  //   .catch(error => {
  //     ConsoleLog.print(error.toString(), 'error', 'SERVER');
  //   });
}
