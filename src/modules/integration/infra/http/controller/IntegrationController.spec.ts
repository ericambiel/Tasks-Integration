import 'reflect-metadata';
import { container } from 'tsyringe';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IIntegrationRepository';
import integrationConnMock from '@modules/integration/infra/mocks/integrationConn.mock';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { fluigUser } from '@modules/fluig/mocks/fluigUser.mock';
import { GoogleClientCredentialType } from '@shared/facades/GoogleAPIFacade';
import IntegrationController from '@modules/integration/infra/http/controller/IntegrationController';
import { sleep } from '@shared/helpers/smallHelper';
import credentials from '../../../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';

// TODO: Necessário mokar repositorio para instanciar serviços
describe('Unit test for Integration controller', () => {
  let controller: IntegrationController;
  let connections: IntegrationConnType[];

  beforeAll(() => {
    // REGITERS
    container.register<IntegrationConnType[]>('IntegrationConnType', {
      useValue: [integrationConnMock],
    });
    container.register<IFluigUserModel[]>('FluigUserModel', {
      useValue: [fluigUser],
    });
    container.register<GoogleClientCredentialType[]>(
      'GoogleClientCredentialType',
      {
        useValue: [credentials],
      },
    );
    container.register<string>('clientCredentialFilePath', {
      useValue: 'src/misc/clients',
    });
    container.register<string>('tokensPath', {
      useValue: 'src/misc/tokens',
    });

    // RESOLVERS
    controller = container.resolve(IntegrationController);
  });

  beforeEach(async () => {
    await sleep(50);
    connections = await controller.listAllConnections();
  });

  it('TESTE', async () => {
    await controller.sendWorkflowFluig(connections[0].fluigUserUUID);
  });
});
