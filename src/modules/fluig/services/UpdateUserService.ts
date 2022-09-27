import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';

@injectable()
export default class UpdateUserService {
  constructor(
    @inject(FluigUserRepository)
    private repository: IFluigUserRepository,
  ) {}

  execute(userUUID: string, user: IFluigUserModel): void {
    this.repository.update(userUUID, user);
  }
}
