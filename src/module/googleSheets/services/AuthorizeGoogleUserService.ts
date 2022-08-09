import { container, inject, injectable } from 'tsyringe';
import GoogleServicesFacade, {
  GoogleServiceCredential,
} from '@shared/facades/GoogleServicesFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';

type AuthorizeGoogleUserServiceOption = {
  /**
   * instance ID of OAuth2Client
   */
  instanceId?: string;
  userToken?: Credentials;
  serviceCredentials: GoogleServiceCredential;
};

@injectable()
export default class AuthorizeGoogleUserService {
  constructor(
    @inject(GoogleServicesFacade)
    private googleSheet: GoogleServicesFacade,
  ) {}

  /**
   * Authorize client with given credentials
   * @param options
   */
  async execute(options: AuthorizeGoogleUserServiceOption) {
    const { serviceCredentials, userToken } = options;
    let { instanceId } = options;

    // Create client if it doesn't exist
    if (!instanceId)
      instanceId = this.googleSheet.clientFactor(serviceCredentials);

    const oAuthClient = this.verifyInstanceExists(instanceId);

    // If token doesn't exist return an authentication token request
    if (!userToken) {
      console.log('Generate a new token');

      const url = this.googleSheet.getAuthUrl(oAuthClient, {
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets.readonly',
          'https://www.googleapis.com/auth/userinfo.profile',
        ],
      });

      return { url, instanceId };
    }

    return this.googleSheet.verifyUserToken(userToken);
    //
    // // Set loaded token
    // oAuthClient.setCredentials(userToken);
    //
    // // Get all values from Sheet
    // return this.googleSheet.getSpreadSheetValues(oAuthClient, spreadsheet);
  }

  // TODO: Need todo ths function, verify if instance exists
  private verifyInstanceExists(instanceId: string) {
    return container.resolve<OAuth2Client>(instanceId);
  }
}
