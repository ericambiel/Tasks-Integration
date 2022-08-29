import { URLSearchParams } from 'url';
import { inject, injectable } from 'tsyringe';
import { Axios } from 'axios';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';

export type JWTPayloadFluig = IFluigUserModel & {
  exp: number;
  iat: number;
  aud: string;
};

@injectable()
export default class AuthorizeUserService {
  constructor(
    @inject(Axios)
    private axios: Axios,
  ) {}

  async execute(username: string, password: string): Promise<JWTPayloadFluig> {
    try {
      const cookies: string[] = await this.getCredentialsCookies(
        username,
        password,
      );
      const authorization: string = await this.getAuthorization(cookies);

      // Set Bear token to all request to this instance
      this.axios.defaults.headers.common = {
        Authorization: authorization,
      };

      // TODO: use celebrate to check received payload attributes
      return extractPayloadFromJWT<JWTPayloadFluig>(authorization);
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
    } = await this.axios.post('portal/api/servlet/login.do', params.toString());

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
    } = await this.axios.get('portal/api/servlet/login.do', {
      headers: {
        Cookie: cookies.toString(),
      },
    });

    if (authorization) return authorization;

    throw Error('Not possible acquire authorization from server');
  }
}
