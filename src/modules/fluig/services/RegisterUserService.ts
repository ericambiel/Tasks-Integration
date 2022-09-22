import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import AxiosFacade from '@shared/facades/AxiosFacade';
import { Axios } from 'axios';
import fluigApi from '@config/fluigApi';

const fluigApiConf = fluigApi();

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

  execute(user: IFluigUserModel): void;

  execute(users: IFluigUserModel[]): void;

  execute(users: IFluigUserModel[] | IFluigUserModel): void {
    if (Array.isArray(users)) users.forEach(user => this.createUser(user));
    else this.createUser(users);
  }

  private createUser(user: IFluigUserModel) {
    this.axiosFacade.axiosFactor({
      baseURL: fluigApiConf.BASEURL,
      Origin: fluigApiConf.ORIGIN,
      instanceId: user.userUUID,
    });
    this.repository.create(user);
  }
}
