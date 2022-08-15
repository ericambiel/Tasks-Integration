import { inject, injectable } from 'tsyringe';
import GoogleServicesFacade from '@shared/facades/GoogleServicesFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';

type AuthorizeGoogleClientServerOption = {
  /**
   * client ID of OAuth2Client
   */
  clientId: string;
  userToken?: Credentials;
};

@injectable()
export default class AuthorizeGoogleClientServer {
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ];

  private readonly getAuthUrl = (oAuthClient: OAuth2Client) =>
    this.googleSheet.getAuthUrl(oAuthClient, {
      askPermission: true,
      scopes: this.SCOPES,
    });

  constructor(
    @inject(GoogleServicesFacade)
    private googleSheet: GoogleServicesFacade,
    @inject(GoogleClientRepository)
    private googleClientRepository: IGoogleClientRepository,
  ) {}

  /**
   * Try to authorize client server with user token or return URL to authorize client server.
   * @param options
   * @return {Promise<string | OAuth2Client>} Instance of OAuth2Client or URL to authorize client server to access user.
   * @author Eric Ambiel
   * @throws Case something wrong return URL to authorize client server to access user.
   *
   */
  async execute(
    options: AuthorizeGoogleClientServerOption,
  ): Promise<string | OAuth2Client> {
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
      return this.getAuthUrl(oAuthClient);
    } catch (err) {
      console.log(`Stored user token is wrong, need re-authentication: ${err}`);
      return this.getAuthUrl(oAuthClient);
    }
  }
}
