import { inject, injectable } from 'tsyringe';
import GoogleServicesFacade from '@shared/facades/GoogleServicesFacade';
import { OAuth2Client } from 'google-auth-library';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import InstanceManagerHelper from '@shared/helpers/InstanceManagerHelper';

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
    @inject(FilesHandlerHelper)
    private filesHandlerHelper: FilesHandlerHelper,
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
    const tokenInfo = await this.googleSheet.getMoreInformationToken(
      oAuthClient,
      newTokenUser.access_token,
    );

    // Set token to client
    oAuthClient.setCredentials(newTokenUser);

    // Get all values from Sheet
    return { oAuthClient, newTokenUser, tokenInfo };
  }
}
