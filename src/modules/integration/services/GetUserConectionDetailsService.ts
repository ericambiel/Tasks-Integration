import { inject } from 'tsyringe';
import IntegrationRepository, {
  IntegrationConnType,
} from '@modules/integration/infra/local/repositories/IntegrationRepository';

export default class GetUserConectionDetailsService {
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
  }) {
    return this.repository.find(options);
  }
}
