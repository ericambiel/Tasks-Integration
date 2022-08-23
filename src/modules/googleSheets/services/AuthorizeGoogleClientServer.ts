import { inject, singleton } from 'tsyringe';
import GoogleAPIFacade from '@shared/facades/GoogleAPIFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';

type AuthorizeGoogleClientServerOption = {
  /**
   * client ID of OAuth2Client
   */
  clientId: string;
  userToken: Credentials;
};

@singleton()
export default class AuthorizeGoogleClientServer {
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
  ];

  private readonly getAuthUrl = (oAuth2Client: OAuth2Client) =>
    this.googleAPI.getAuthUrl(oAuth2Client, {
      askPermission: true,
      scopes: this.SCOPES,
    });

  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleClientRepository)
    private repository: IGoogleClientRepository,
  ) {}

  /**
   * Try to authorize client server with user token or return URL to authorize client server.
   * @param options
   * @return {Promise<string | OAuth2Client>} Instance of OAuth2Client or URL to authorize client server to access user.
   * @author Eric Ambiel
   * @throws Case something wrong return URL to authorize client server to access user.
   *
   */
  async execute(options: AuthorizeGoogleClientServerOption): Promise<void> {
    const oAuth2Client = this.repository.findById(options.clientId);

    try {
      oAuth2Client.setCredentials(options.userToken);
      await oAuth2Client.refreshAccessToken(); // After refresh, set too.
      // TODO: use this oAuth2Client to update token, need retrieve tokenInfo before update token file
      // return oAuth2Client;
    } catch (err) {
      console.error(
        `Re-authentication is needed, same thing wrong with Client credentials: ${err}`,
      );
      throw Error(this.getAuthUrl(oAuth2Client));
    }
  }
}
