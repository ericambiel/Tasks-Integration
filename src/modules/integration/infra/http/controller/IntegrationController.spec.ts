import 'reflect-metadata';
import { container } from 'tsyringe';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IIntegrationRepository';
import integrationConnMock from '@modules/integration/infra/mocks/integrationConn.mock';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { GoogleClientCredentialType } from '@shared/facades/GoogleAPIFacade';
import IntegrationController from '@modules/integration/infra/http/controller/IntegrationController';
import { UserTokenInfoType } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import AuthorizeUserToClientGoogleServerService from '@modules/googleSheets/services/AuthorizeUserToClientGoogleServerService';
import { authorizeUserAxiosFluigTester } from '@shared/__test__/helper.test';
import usersToken from '../../../../../misc/tokens/108866897033893388302.token.json';
import credentials from '../../../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';

// TODO: Necessário mokar repositorio para instanciar serviços
describe('Unit test for Integration controller', () => {
  let serviceAuth: AuthorizeUserToClientGoogleServerService;

  let controller: IntegrationController;
  let connections: IntegrationConnType[];

  beforeAll(() => {
    // REGISTERS
    // -- Integration Module
    container.register<IntegrationConnType[]>('IntegrationConnType', {
      useValue: [integrationConnMock],
    });
    // -- Google Module
    container.register<UserTokenInfoType[]>('UserTokenInfoType', {
      useValue: [usersToken],
    });
    container.register<GoogleClientCredentialType[]>(
      'GoogleClientCredentialType',
      {
        useValue: [credentials],
      },
    );
    // -- Fluig module
    container.register<IFluigUserModel[]>('FluigUserModel', {
      useValue: [],
    });

    // RESOLVERS
    controller = container.resolve(IntegrationController);
    serviceAuth = container.resolve(AuthorizeUserToClientGoogleServerService);

    authorizeUserAxiosFluigTester();
  });

  beforeEach(async () => {
    connections = await controller.listAllConnections();
    await serviceAuth.execute({
      clientId: connections[0].googleClientId[0],
      userSUB: connections[0].googleUserSUB,
    });
  });

  it('Shold be possible send Workflow to Fluig', async () => {
    await controller.sendWorkflowFluig(connections[0].fluigUserUUID);
  });
});
