import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';

@injectable()
export default class GetFluigUserService {
  constructor(
    @inject(FluigUserRepository)
    private repository: FluigUserRepository,
  ) {}

  async execute(userUUID: string) {
    return this.repository.findById(userUUID);
  }
}
