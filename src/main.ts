import 'reflect-metadata';
import dotEnvSafe from 'dotenv-safe';
// import routes from '@shared/infra/http/routes';

import ConsoleLog from '@libs/ConsoleLog';
import { container } from 'tsyringe';
import { IGoogleUserRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import AuthorizeUserToClientGoogleServer from '@modules/googleSheets/services/AuthorizeUserToClientGoogleServer';
import CredentialsFluigUserService from '@modules/fluig/services/CredentialsFluigUserService';
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
import UpdateUserService from '@modules/fluig/services/UpdateUserService';
// import startExpressServer from './vendor/app';

// Load Environments from .env
dotEnvSafe.config({ allowEmptyValues: true });

ConsoleLog.print('Starting server...', 'info', 'SERVER');

// TODO: It need to create a controller for that, and some services.
function getFluigUsersCredentials(): Promise<SheetFluigUser[]> {
  const integrationConfig = integration();
  const getSpreadSheetService = container.resolve(GetSpreadsheetService);
  const getSpreadsheetDetailsService = container.resolve(
    GetSpreadsheetDetailsService,
  );
  const authorizeUserToClientGoogleServer = container.resolve(
    AuthorizeUserToClientGoogleServer,
  );
  const googleUserRepository = container.resolve(GoogleUserRepository);
  const googleClientRepository = container.resolve(GoogleClientRepository);
  const googleUsers = googleUserRepository.list();
  const {
    web: { client_id: clientId },
  } = googleClientRepository.list()[0]; // Get first Google Client

  return Promise.all(
    googleUsers.map(async googleUser => {
      // Authorize User to use Google Client
      await authorizeUserToClientGoogleServer.execute({
        userSUB: googleUser.user_information.sub,
        clientId,
      });

      const spreadsheetsMeta = await getSpreadsheetDetailsService.execute(
        clientId,
        integrationConfig.TASK_SPREADSHEET,
      );

      if (!spreadsheetsMeta[0].id)
        throw ConsoleLog.print(
          `Can't get spreadsheet from Google User: ${googleUser.user_information.sub}`,
          'error',
          'SERVER',
        );

      // TODO: Create Integration repository and match userUUID, ClientID, userSUB

      // Get fluig credentials from spreadsheet
      const spreadsheetFluigUser = await getSpreadSheetService
        .execute(clientId, {
          spreadsheetId: spreadsheetsMeta[0].id,
          range: 'Configurações!F2:H3',
        })
        .then(FluigUsers => FluigUsers[0]);

      return plainToInstance(SheetFluigUser, spreadsheetFluigUser);
    }),
  );
}

function authorizeFluigUsers(fluigUsersSheet: ISheetFluigUser[]) {
  const serviceRegister = container.resolve(RegisterUserService);
  const serviceUpdate = container.resolve(UpdateUserService);

  return Promise.all(
    fluigUsersSheet.map(async fluigUserSheet => {
      // Authorize user in Fluig
      const { headers, jWTPayload } = await container
        .resolve(CredentialsFluigUserService)
        .execute(fluigUserSheet.username, fluigUserSheet.password);

      // Converte Bear JTW to user model
      const fluigUser = plainToInstance(FluigUserModel, jWTPayload);

      // Register fluig user in the system (Repository and Axios)
      serviceRegister.execute(fluigUser, headers);

      // Get more information about User
      fluigUser.userInfo = await container
        .resolve(GetUserInformation)
        .execute(fluigUser.userUUID, fluigUser.sub);

      // Update
      serviceUpdate.execute(fluigUser.userUUID, fluigUser);
    }),
  );
}

async function startFluigApi() {
  const fluigUsersCredentials = await getFluigUsersCredentials();

  await authorizeFluigUsers(fluigUsersCredentials);
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
