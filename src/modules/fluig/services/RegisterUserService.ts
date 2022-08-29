import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import AxiosFacade from '@shared/facades/AxiosFacade';
import { Axios } from 'axios';

@injectable()
export default class RegisterUserService {
  constructor(
    @inject(FluigUserRepository)
    private repository: IFluigUserRepository,
    @inject(AxiosFacade)
    private axiosFacade: AxiosFacade,
    @inject(Axios)
    private axios: Axios,
  ) {}

  execute(user: IFluigUserModel) {
    this.axiosFacade.container.registerInstance(user.userUUID, this.axios);
    this.repository.create(user);
  }
}
