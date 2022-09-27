import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import AxiosFacade from '@shared/facades/AxiosFacade';
import fluigApi from '@config/fluigApi';
import { AuthHeaders } from '@shared/helpers/FluigAPIHelper';

const fluigApiConf = fluigApi();

@injectable()
export default class RegisterUserService {
  constructor(
    @inject(FluigUserRepository)
    private repository: IFluigUserRepository,
    @inject(AxiosFacade)
    private axiosFacade: AxiosFacade,
  ) {}

  execute(user: IFluigUserModel, credentials: AuthHeaders): void {
    this.axiosFacade.axiosFactor({
      baseURL: fluigApiConf.BASEURL,
      Origin: fluigApiConf.ORIGIN,
      instanceId: user.userUUID,
      headers: credentials,
    });

    this.repository.create(user);
  }
}
