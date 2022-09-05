import { inject, injectable } from 'tsyringe';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';
import FluigAPIHelper from '@shared/helpers/FluigAPIHelper';

export type JWTPayloadFluig = IFluigUserModel & {
  exp: number;
  iat: number;
  aud: string;
};

@injectable()
export default class AuthorizeFluigUserService {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(username: string, password: string): Promise<JWTPayloadFluig> {
    try {
      const authorization: string = await this.fluigAPIHelper.loginUser(
        username,
        password,
      );

      // TODO: use celebrate to check received payload attributes
      return extractPayloadFromJWT<JWTPayloadFluig>(authorization);
    } catch (e) {
      throw new Error(`${e}`);
    }
  }
}
