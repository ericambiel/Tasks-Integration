import { URLSearchParams } from 'url';
import { inject, singleton } from 'tsyringe';
import { Axios } from 'axios';
import {
  IFluigUserModel,
  FluigUserModel,
} from '@modules/fluig/infra/local/models/FluigUserModel';
import AxiosFacade from '@shared/facades/AxiosFacade';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import { plainToInstance } from 'class-transformer';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';

type JWTPayloadFluig = IFluigUserModel & {
  exp: number;
  iat: number;
  aud: string;
};

@singleton()
export default class AuthorizeUserService {
  private readonly AXIOS_DEFAULT_INSTANCE_NAME = 'axiosCleanInstanceFluig';

  private readonly AXIOS_DEFAULT_INSTANCE: Axios;

  constructor(
    @inject(AxiosFacade)
    private axiosFacade: AxiosFacade,
    // @inject(DependencyContainer)
    // private axiosContainer: DependencyContainer,
    @inject(FluigUserRepository)
    private repository: IFluigUserRepository,
  ) {
    this.AXIOS_DEFAULT_INSTANCE = axiosFacade
      .getContainer()
      .resolve('axiosCleanInstanceFluig');
  }

  async execute(username: string, password: string): Promise<void> {
    try {
      const cookies: string[] = await this.getCredentialsCookies(
        username,
        password,
      );
      const authorization: string = await this.getAuthorization(cookies);

      // TODO: use celebrate to check received payload attributes
      const payload = extractPayloadFromJWT<JWTPayloadFluig>(authorization);

      const fluigUser: IFluigUserModel = plainToInstance(
        FluigUserModel,
        payload,
        { excludeExtraneousValues: true },
      );

      const axios = this.axiosFacade.cloneInstance(
        this.AXIOS_DEFAULT_INSTANCE_NAME,
        payload.userUUID,
      );
      // Set Bear token to all request to this instance
      axios.defaults.headers.common = {
        Authorization: authorization,
      };

      this.repository.create(fluigUser);
    } catch (e) {
      throw new Error(`${e}`);
    }
  }

  /**
   * Get credential cookies for informed user
   * @param username
   * @param password
   * @private
   * @author Eric Ambiel
   */
  private async getCredentialsCookies(
    username: string,
    password: string,
  ): Promise<string[]> {
    const params = new URLSearchParams({
      j_username: username,
      j_password: password,
      keepalive: 'false',
    });

    // Get Cookies
    const {
      headers: { 'set-cookie': setCookie },
    } = await this.AXIOS_DEFAULT_INSTANCE.post(
      'portal/api/servlet/login.do',
      params.toString(),
    );

    if (setCookie) return setCookie;

    throw Error('Not possible acquire cookies from server');
  }

  /**
   * Get Authorization Bear Token from headers given credential cookies
   * @param cookies
   * @private
   * @author Eric Ambiel
   */
  private async getAuthorization(cookies: string[]): Promise<string> {
    const {
      headers: { authorization },
    } = await this.AXIOS_DEFAULT_INSTANCE.get('portal/api/servlet/login.do', {
      headers: {
        Cookie: cookies.toString(),
      },
    });

    if (authorization) return authorization;

    throw Error('Not possible acquire authorization from server');
  }
}
