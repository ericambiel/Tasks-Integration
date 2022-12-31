import { inject, injectable } from 'tsyringe';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import AxiosFacade from '@shared/facades/AxiosFacade';
import fluigApi from '@config/fluigApi';
import { AuthHeaders } from '@shared/helpers/FluigAPIHelper';

@injectable()
export default class RegisterUserService {
  private readonly FLUIG_API_CONF = fluigApi();

  constructor(
    @inject(FluigUserRepository)
    private repository: IFluigUserRepository,
    @inject(AxiosFacade)
    private axiosFacade: AxiosFacade,
  ) {}

  execute(user: IFluigUserModel, credentials: AuthHeaders): void {
    this.axiosFacade.axiosFactor({
      baseURL: this.FLUIG_API_CONF.BASEURL,
      Origin: this.FLUIG_API_CONF.ORIGIN,
      instanceId: user.userUUID,
      headers: credentials,
    });

    this.repository.create(user);
  }
}
