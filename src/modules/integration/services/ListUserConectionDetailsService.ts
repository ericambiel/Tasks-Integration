import { inject } from 'tsyringe';
import IntegrationRepository from '@modules/integration/infra/local/repositories/IntegrationRepository';

export default class ListUserConectionDetailsService {
  constructor(
    @inject(IntegrationRepository)
    private repository: IntegrationRepository,
  ) {}

  execute() {
    return this.repository.list();
  }
}
