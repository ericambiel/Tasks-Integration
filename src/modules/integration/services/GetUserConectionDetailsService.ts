import { inject, singleton } from 'tsyringe';
import IntegrationRepository from '@modules/integration/infra/local/repositories/IntegrationRepository';
import IGetUserConectionDetailsService from '@modules/integration/services/IGetUserConectionDetailsService';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IIntegrationRepository';

@singleton()
export default class GetUserConectionDetailsService
  implements IGetUserConectionDetailsService
{
  constructor(
    @inject(IntegrationRepository)
    private repository: IntegrationRepository,
  ) {}

  execute(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
  }): IntegrationConnType | undefined;

  execute(options: {
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined;

  execute(options: {
    fluigUserUUID: IntegrationConnType['fluigUserUUID'];
    googleUserSUB: IntegrationConnType['googleUserSUB'];
  }): IntegrationConnType | undefined {
    return this.repository.find(options);
  }
}
