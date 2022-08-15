import { inject, injectable } from 'tsyringe';
import GoogleServicesFacade from '@shared/facades/GoogleServicesFacade';
import { Credentials } from 'google-auth-library';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';

type AuthorizeGoogleUserServiceOption = {
  /**
   * client ID of OAuth2Client
   */
  clientId: string;
  userToken?: Credentials;
  // serviceCredentials: GoogleClientCredential;
};

@injectable()
export default class AuthorizeGoogleUserService {
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ];

  constructor(
    @inject(GoogleServicesFacade)
    private googleSheet: GoogleServicesFacade,
    @inject(GoogleClientRepository)
    private googleClientRepository: IGoogleClientRepository,
  ) {}

  /**
   * Authorize client with given credentials
   * @param options
   */
  async execute(options: AuthorizeGoogleUserServiceOption) {
    // TODO: Move to a Service that create clients in initialization of API
    // Create client if it doesn't exist
    // if (!instanceId)
    //   instanceId = this.googleSheet.clientFactor(serviceCredentials);

    const oAuthClient = this.googleClientRepository.findById(options.clientId);

    try {
      if (options.userToken) {
        const refreshedToken = await oAuthClient.refreshAccessToken();
        oAuthClient.setCredentials(refreshedToken.credentials);
        return oAuthClient;
      }
      console.log(
        'User token was NOT informed, generating link authorization for new token',
      );

      // If token doesn't informed return an authorization URL token
      return this.googleSheet.getAuthUrl(oAuthClient, {
        askPermission: true,
        scopes: this.SCOPES,
      });
    } catch (err) {
      console.log(`Stored user token is wrong, need re-authentication: ${err}`);
      return this.googleSheet.getAuthUrl(oAuthClient, {
        askPermission: true,
        scopes: this.SCOPES,
      });
    }
  }
}
