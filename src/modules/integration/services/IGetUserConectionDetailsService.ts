import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IIntegrationRepository';

export default interface IGetUserConectionDetailsService {
  execute(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
  }): IntegrationConnType | undefined;

  execute(options: {
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined;

  execute(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined;
}
