import { inject, injectable } from 'tsyringe';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';
import FluigAPIHelper, { AuthHeaders } from '@shared/helpers/FluigAPIHelper';
import ConsoleLog from '@libs/ConsoleLog';

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

      const jWTPayload = extractPayloadFromJWT<JWTPayloadFluig>(
        headers.Authorization,
      );

      // TODO: use celebrate to check received payload attributes
      return {
        jWTPayload,
        headers,
      };
    } catch (err) {
      throw ConsoleLog.print(<Error>err, 'error', 'FLUIGMODULE');
    }
  }
}
