import 'reflect-metadata';
import dotEnvSafe from 'dotenv-safe';
// import routes from '@shared/infra/http/routes';

import ConsoleLog from '@libs/ConsoleLog';
import { container } from 'tsyringe';
import { IGoogleUserRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import AuthorizeUserToClientGoogleServer from '@modules/googleSheets/services/AuthorizeUserToClientGoogleServer';
import AuthorizeFluigUserService from '@modules/fluig/services/AuthorizeFluigUserService';
import { FluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { plainToInstance } from 'class-transformer';
import GetUserInformation from '@modules/fluig/services/GetUserInformation';
import RegisterUserService from '@modules/fluig/services/RegisterUserService';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import GetSpreadsheetDetailsService from '@modules/googleSheets/services/GetSpreadsheetDetailsService';
import integration from '@config/integration';
import SheetFluigUser, {
  ISheetFluigUser,
} from '@modules/integration/infra/local/models/SheetFluigUser';
import googleApi from '@config/googleApi';
import { IGoogleClientRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleClientRepository';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
// import startExpressServer from './vendor/app';

// Load Environments from .env
dotEnvSafe.config({ allowEmptyValues: true });

ConsoleLog.print('Starting server...', 'info', 'SERVER');

// TODO: It need to create a controller for that, and some services.
function getCredentialsFluigUsers() {
  const integrationConfig = integration();
  const getSpreadSheetService = container.resolve(GetSpreadsheetService);
  const getSpreadsheetDetailsService = container.resolve(
    GetSpreadsheetDetailsService,
  );
  const authorizeUserToClientGoogleServer = container.resolve(
    AuthorizeUserToClientGoogleServer,
  );
  const googleUserRepository = container.resolve(GoogleUserRepository);
  const googleUsers = googleUserRepository.list();

  return Promise.all(
    googleUsers.map(async googleUser => {
      // Authorize User to use Google Client
      await authorizeUserToClientGoogleServer.execute({
        userToken: googleUser,
      });

      const spreadsheetsMeta = await getSpreadsheetDetailsService.execute(
        integrationConfig.TASK_SPREADSHEET,
      );

      if (!spreadsheetsMeta[0].id)
        throw new Error(
          `Something wrong with spreadsheet, GUser: ${googleUser.user_information.sub}`,
        );

      // Get fluig credentials from spreadsheet
      const spreadsheetFluigUserDTO = getSpreadSheetService.execute({
        spreadsheetId: spreadsheetsMeta[0].id,
        range: 'Configurações!A1:B2',
      });

      return plainToInstance(SheetFluigUser, spreadsheetFluigUserDTO);
    }),
  );
}

function getAuthorizedFluigUsers(fluigUsersSheet: ISheetFluigUser[]) {
  return Promise.all(
    fluigUsersSheet.map(async fluigUserSheet => {
      // Authorize user in Fluig
      const authorization = container
        .resolve(AuthorizeFluigUserService)
        .execute(fluigUserSheet.username, fluigUserSheet.password);

      // Converte Bear JTW to user model
      const fluigUser = plainToInstance(FluigUserModel, authorization);

      // Get more information about User
      fluigUser.userInfo = await container
        .resolve(GetUserInformation)
        .execute(fluigUser.sub);

      return fluigUser;
    }),
  );
}

async function startFluigApi() {
  const fluigUsersCredentials = await getCredentialsFluigUsers();

  const authorizedFluigUsers = await getAuthorizedFluigUsers(
    fluigUsersCredentials,
  );

  // Register all fluig users in the system (Repository and Axios)
  container.resolve(RegisterUserService).execute(authorizedFluigUsers);
}

async function startGoogleApi() {
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

  const serviceAuth = container.resolve(AuthorizeUserToClientGoogleServer);
  const usersToken = repositoryUser.list();

  // Authorize all Google users
  await Promise.all(
    usersToken.map(userToken => serviceAuth.execute({ userToken })),
  );
}

export default async function main() {
  await startGoogleApi();
  await startFluigApi();

  // startExpressServer(routes)
  //   .then(() => {
  //     ConsoleLog.print('Express Server was started', 'info', 'SERVER');
  //   })
  //   .catch(error => {
  //     ConsoleLog.print(error.toString(), 'error', 'SERVER');
  //   });
}
