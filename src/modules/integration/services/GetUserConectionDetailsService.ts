import { inject } from 'tsyringe';
import IntegrationRepository, {
  IntegrationConn,
} from '@modules/integration/infra/local/repositories/IntegrationRepository';

export default class GetUserConectionDetailsService {
  constructor(
    @inject(IntegrationRepository)
    private repository: IntegrationRepository,
  ) {}

  execute(options: {
    fluigUserUUID: IntegrationConn['fluigUserUUID'];
  }): IntegrationConn | undefined;

  execute(options: {
    googleUserSUB: IntegrationConn['googleUserSUB'];
  }): IntegrationConn | undefined;

  execute(options: {
    fluigUserUUID: IntegrationConn['fluigUserUUID'];
    googleUserSUB: IntegrationConn['googleUserSUB'];
  }) {
    return this.repository.find(options);
  }
}
