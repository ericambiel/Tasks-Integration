import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IntegrationRepository';

export default interface IListUserConectionDetailsService {
  execute(): IntegrationConnType[];
}
