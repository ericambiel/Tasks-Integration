import { inject, singleton } from 'tsyringe';
import IntegrationRepository, {
  IntegrationConnType,
} from '@modules/integration/infra/local/repositories/IntegrationRepository';
import IListUserConectionDetailsService from '@modules/integration/services/IListUserConectionDetailsService';

@singleton()
export default class ListUserConectionDetailsService
  implements IListUserConectionDetailsService
{
  constructor(
    @inject(IntegrationRepository)
    private repository: IntegrationRepository,
  ) {}

  execute(): IntegrationConnType[] {
    return this.repository.list();
  }
}
