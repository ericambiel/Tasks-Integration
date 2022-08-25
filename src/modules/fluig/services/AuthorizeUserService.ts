import { URLSearchParams } from 'url';
import { container, inject, singleton } from 'tsyringe';
import { Axios } from 'axios';

type JWTPayloadFluig = {
  sub: string;
  role: string;
  tenant: number;
  userTenantId: number;
  userType: number;
  userUUID: string;
  tenantUUID: string;
  lastUpdateDate: number;
  userTimeZone: string;
  exp: number;
  iat: number;
  aud: string;
};

@singleton()
export default class AuthorizeUserService {
  constructor(
    @inject(Axios)
    private axiosInstance: Axios,
  ) {}

  async execute(username: string, password: string) {
    const cookies: string[] = await this.getCredentialsCookies(
      username,
      password,
    );

    const authorization: string = await this.getAuthorization(cookies);

    const payload = this.extractPayloadFromJWT<JWTPayloadFluig>(authorization);

    // Set Bear token to all request to this instance
    this.axiosInstance.defaults.headers.common = {
      Authorization: authorization,
    };

    // Register Axios instance to be used in the next requests
    container.registerInstance<Axios>(payload.userUUID, this.axiosInstance);
  }

  /**
   * Get credentials cookies to given user
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
    } = await this.axiosInstance.post(
      'portal/api/servlet/login.do',
      params.toString(),
    );

    if (setCookie) return setCookie;

    throw Error('Not possible acquire cookies from server');
  }

  /**
   * Get Authorization Bear Token from headers given cookies credentials
   * @param cookies
   * @private
   * @author Eric Ambiel
   */
  private async getAuthorization(cookies: string[]): Promise<string> {
    const {
      headers: { authorization },
    } = await this.axiosInstance.get('portal/api/servlet/login.do', {
      headers: {
        Cookie: cookies.toString(),
      },
    });

    if (authorization) return authorization;

    throw Error('Not possible acquire authorization from server');
  }

  /**
   * Extract payload from given JWT
   * @param jWT
   * @private
   * @author Eric Ambiel
   */
  private extractPayloadFromJWT<T>(jWT: string): T {
    // Convert JWT Token to payload
    const jWTSplit = jWT.split('.')[1];
    const decodedJWTSplit = Buffer.from(jWTSplit, 'base64').toString();
    return <T>JSON.parse(decodedJWTSplit);
  }
}
