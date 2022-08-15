import { inject, injectable } from 'tsyringe';
import GoogleServicesFacade from '@shared/facades/GoogleServicesFacade';
import { OAuth2Client } from 'google-auth-library';
import InstanceManagerHelper from '@shared/helpers/InstanceManagerHelper';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

type GenerateGoogleUserTokenServiceOption = {
  /**
   * A code validation for a new token.
   */
  validationTokenCode: string;
  /**
   * instance ID of OAuth2Client
   */
  instanceId: string;
};

@injectable()
export default class GenerateGoogleUserTokenService {
  constructor(
    @inject(GoogleServicesFacade)
    private googleSheet: GoogleServicesFacade,
    @inject(GoogleUserRepository)
    private repository: GoogleUserRepository,
  ) {}

  async execute(options: GenerateGoogleUserTokenServiceOption) {
    const { validationTokenCode, instanceId } = options;

    const oAuthClient =
      InstanceManagerHelper.getInstanceById<OAuth2Client>(instanceId);

    const newTokenUser = await this.googleSheet.getNewToken(
      oAuthClient,
      validationTokenCode,
    );

    if (!newTokenUser.access_token)
      throw new Error(
        'Something wrong with taken new token, property "access_token" doesnt exists',
      );

    // Get more information from user giving a token
    const tokenInfo = await this.googleSheet.getTokenInformation(
      oAuthClient,
      newTokenUser.access_token,
    );

    // Set token to client
    oAuthClient.setCredentials(newTokenUser);

    // Save token on disc
    this.repository.save({ ...newTokenUser, token_info: tokenInfo });

    return oAuthClient;
  }
}
