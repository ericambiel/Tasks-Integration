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
import { api } from '@configs/*';
// import startExpressServer from './vendor/app';

// Load Environments from .env
config({ allowEmptyValues: true });

const API_CONF = api();

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
    ConsoleLog.print(
      `Scheduling JOB to “sendWorkflowFluig”, Fluig user: ${conn.fluigUserUUID}`,
      'info',
      'SERVER',
      API_CONF.SILENT_MODE,
    );
    // cronScheduler.jobMaker(
    //   () => integratorController.sendWorkflowFluig(conn.googleUserSUB),
    //   {
    //     code: conn.connId,
    //   },
    // );
    integratorController.sendWorkflowFluig(conn.googleUserSUB);
  });
}

export default async function main() {
  ConsoleLog.print('Starting server...', 'info', 'SERVER');

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

main()
  .then(() => ConsoleLog.print('Ended start server...', 'info', 'SERVER'))
  .catch(err => {
    throw ConsoleLog.print(<Error>err, 'error', 'SERVER');
  });
