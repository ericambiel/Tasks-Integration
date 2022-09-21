import 'reflect-metadata';
import dotEnvSafe from 'dotenv-safe';
// import routes from '@shared/infra/http/routes';

import ConsoleLog from '@libs/ConsoleLog';
import { container } from 'tsyringe';
import googleApi from '@config/googleApi';
import { IGoogleClientRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleClientRepository';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import { IGoogleUserRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import AuthorizeUserToClientGoogleServer from '@modules/googleSheets/services/AuthorizeUserToClientGoogleServer';
import CronSchedulerFacade from '@shared/facades/CronSchedulerFacade';
import { Axios } from 'axios';
import AuthorizeFluigUserService from '@modules/fluig/services/AuthorizeFluigUserService';
import {
  FluigUserModel,
  IFluigUserModel,
} from '@modules/fluig/infra/local/models/FluigUserModel';
import { plainToInstance } from 'class-transformer';
import GetUserInformation from '@modules/fluig/services/GetUserInformation';
import RegisterUserService from '@modules/fluig/services/RegisterUserService';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import AxiosFacade from '@shared/facades/AxiosFacade';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import GetSpreadsheetDetailsService from '@modules/googleSheets/services/GetSpreadsheetDetailsService';
import integration from '@config/integration';
import SpreadsheetFluigUser from '@modules/integration/infra/local/models/SpreadsheetFluigUser';
import startExpressServer from './vendor/app';

// Load Environments from .env
dotEnvSafe.config({ allowEmptyValues: true });

const googleApiConfig = googleApi();
const integrationConfig = integration();

ConsoleLog.print('Starting server...', 'info', 'SERVER');

async function startFluigApi() {
  // Create clean instance Axios
  const axiosFacade = container.resolve(AxiosFacade);
  const googleUserRepository = container.resolve(GoogleUserRepository);
  const getSpreadSheetService = container.resolve(GetSpreadsheetService);
  const getSpreadsheetDetailsService = container.resolve(
    GetSpreadsheetDetailsService,
  );
  const authorizeUserToClientGoogleServer = container.resolve(
    AuthorizeUserToClientGoogleServer,
  );

  const googleUsers = googleUserRepository.list();

  const fluigUsersSheet = await Promise.all(
    googleUsers.map(async googleUser => {
      // Authorize User to use Google Client
      await authorizeUserToClientGoogleServer.execute({
        userToken: googleUser,
      });

      const spreadsheetsMeta = await getSpreadsheetDetailsService.execute(
        integrationConfig.INTEGRATION_TASK_SPREADSHEET,
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

      return plainToInstance(SpreadsheetFluigUser, spreadsheetFluigUserDTO);
    }),
  );

  const fluigUsers = await Promise.all(
    fluigUsersSheet.map(async fluigUserSheet => {
      // Register axios instance for each google user
      axiosFacade.axiosFactor({
        baseURL: process.env.FLUIG_BASEURL ?? '',
        Origin: process.env.FLUIG_ORIGIN ?? '',
        instanceId: fluigUserSheet.username,
      });

      // Authorize Fluig User
      const authorization = container
        .resolve(AuthorizeFluigUserService)
        .execute(fluigUserSheet.username, fluigUserSheet.password);

      // Converte Bear JTW to user model
      const fluigUser: IFluigUserModel = plainToInstance(
        FluigUserModel,
        authorization,
      );

      // Get more information about User
      fluigUser.userInfo = await container
        .resolve(GetUserInformation)
        .execute(fluigUser.sub);

      return fluigUser;
    }),
  );

  // Register User in the system (Repository and Axios)
  // container.register<IFluigUserModel[]>('IFluigUserModel', {
  //   useValue: [],
  // });
  // TODO: Stop here, for each fluigUsers register it in Factor Axios
  container.resolve(RegisterUserService).execute(fluigUsers);

  // Get repository from users registered
  const repository =
    container.resolve<IFluigUserRepository>(FluigUserRepository);

  // List all users Registered
  const registeredUsers = repository.list();

  // Get Axios instance with authorized fluig user
  const axiosAuthorizedClient = container
    .resolve(AxiosFacade)
    .container.resolve<Axios>(registeredUsers[0].userUUID);
}

function startGoogleApi() {
  const cronScheduler = new CronSchedulerFacade();

  // TODO: Leave all this to controller
  container.register<string>('clientCredentialFilePath', {
    useValue: googleApiConfig.GOOGLE_API_CLIENTS_PATH,
  });

  container.register<string>('tokensPath', {
    useValue: googleApiConfig.GOOGLE_API_TOKENS_PATH,
  });

  const repositoryClient = container.resolve<IGoogleClientRepository>(
    GoogleClientRepository,
  );

  const repositoryUser =
    container.resolve<IGoogleUserRepository>(GoogleUserRepository);

  const serviceAuth = container.resolve(AuthorizeUserToClientGoogleServer);
  const clientsCredential = repositoryClient.list();
  const usersToken = repositoryUser.list();
  //

  // TODO: Make Cron Job to call controller that will sincronize spreadsheet to Fluig every time
  cronScheduler.jobMaker(func);
}

startExpressServer(routes)
  .then(() => {
    ConsoleLog.print('Express Server was started', 'info', 'SERVER');
  })
  .catch(error => {
    ConsoleLog.print(error.toString(), 'error', 'SERVER');
  });
