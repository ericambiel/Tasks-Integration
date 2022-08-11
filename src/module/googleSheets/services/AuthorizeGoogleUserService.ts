import { inject, injectable } from 'tsyringe';
import GoogleServicesFacade from '@shared/facades/GoogleServicesFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';
import InstanceManagerHelper from '@shared/helpers/InstanceManagerHelper';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';
import { IGoogleUserRepository } from '../infra/local/repositories/IGoogleUserRepository';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';

type AuthorizeGoogleUserServiceOption = {
  /**
   * instance ID of OAuth2Client
   */
  instanceId: string;
  userToken?: Credentials;
  // serviceCredentials: GoogleClientCredential;
};

@injectable()
export default class AuthorizeGoogleUserService {
  constructor(
    @inject(GoogleServicesFacade)
    private googleSheet: GoogleServicesFacade,
    @inject(GoogleUserRepository)
    private googleUserRepository: IGoogleUserRepository,
    @inject(GoogleClientRepository)
    private googleClientRepository: IGoogleClientRepository,
  ) {}

  /**
   * Authorize client with given credentials
   * @param options
   */
  async execute(options: AuthorizeGoogleUserServiceOption) {
    const { userToken } = options;
    const { instanceId } = options;

    // TODO: Move to a Service that create clients in initialization of API
    // Create client if it doesn't exist
    // if (!instanceId)
    //   instanceId = this.googleSheet.clientFactor(serviceCredentials);

    // TODO: Move this to controller and inject to this class
    // const oAuthClient = this.googleUserRepository.getClient(instanceId);
    const oAuthClient =
      InstanceManagerHelper.getInstanceById<OAuth2Client>(instanceId);

    // If token doesn't informed return an authentication URL token
    if (userToken) return this.googleSheet.verifyUserToken(userToken);

    console.log('Generate a new token');

    return this.googleSheet.getAuthUrl(oAuthClient, {
      scopes: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ],
    });

    //
    // // Set loaded token
    // oAuthClient.setCredentials(userToken);
    //
    // // Get all values from Sheet
    // return this.googleSheet.getSpreadSheetValues(oAuthClient, spreadsheet);
  }
}
