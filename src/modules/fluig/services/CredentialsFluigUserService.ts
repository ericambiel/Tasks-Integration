import { inject, injectable } from 'tsyringe';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';
import FluigAPIHelper, { AuthHeaders } from '@shared/helpers/FluigAPIHelper';

export type JWTPayloadFluig = IFluigUserModel & {
  exp: number;
  iat: number;
  aud: string;
};

export type FluigCredentials = {
  jWTPayload: JWTPayloadFluig;
  headers: AuthHeaders;
};

@injectable()
export default class CredentialsFluigUserService {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(username: string, password: string): Promise<FluigCredentials> {
    try {
      const headers = await this.fluigAPIHelper.geUserCredentials(
        username,
        password,
      );

      // TODO: use celebrate to check received payload attributes
      return {
        jWTPayload: extractPayloadFromJWT<JWTPayloadFluig>(
          headers.Authorization,
        ),
        headers,
      };
    } catch (e) {
      throw new Error(`${e}`);
    }
  }
}
