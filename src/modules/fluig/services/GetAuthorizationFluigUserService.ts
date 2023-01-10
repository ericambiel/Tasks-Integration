import { inject, injectable } from 'tsyringe';
import {
  extractPayloadFromJWT,
  JWTPayloadClaims,
} from '@shared/helpers/smallHelper';
import FluigAPIHelper, { AuthHeaders } from '@shared/helpers/FluigAPIHelper';
import ConsoleLog from '@libs/ConsoleLog';

export type JWTFluigPayload = {
  role: string;
  tenant: number;
  userTenantId: number;
  userType: number;
  userUUID: string;
  tenantUUID: string;
  lastUpdateDate: number;
  userTimeZone: string;
};

export type FluigCredentialsType = {
  jWTPayload: JWTFluigPayload & JWTPayloadClaims;
  headers: AuthHeaders;
};

@injectable()
export default class GetAuthorizationFluigUserService {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(
    username: string,
    password: string,
  ): Promise<FluigCredentialsType> {
    try {
      const headers = await this.fluigAPIHelper.geUserCredentials(
        username,
        password,
      );

      const jWTPayload = extractPayloadFromJWT<JWTFluigPayload>(
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
