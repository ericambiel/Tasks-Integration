import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import IGetFluigUserService from '@modules/fluig/services/IGetFluigUserService';
import { FluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';

@injectable()
export default class GetFluigUserService implements IGetFluigUserService {
  constructor(
    @inject(FluigUserRepository)
    private repository: FluigUserRepository,
  ) {}

  execute(userUUID: string): FluigUserModel {
    return this.repository.findById(userUUID);
  }
}
