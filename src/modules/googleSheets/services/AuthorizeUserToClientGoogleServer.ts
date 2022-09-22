import { inject, singleton } from 'tsyringe';
import GoogleAPIFacade, {
  MinimumScopesType,
} from '@shared/facades/GoogleAPIFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';

type AuthorizeGoogleClientServerOption = {
  /** Google user credential, acquired from token */
  userToken: Credentials;
  /** if not given it, will be used the first registered client instance */
  clientId?: string;
};

/**
 * @author Eric Ambiel
 */
@singleton()
export default class AuthorizeUserToClientGoogleServer {
  private readonly SCOPES: MinimumScopesType = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ];

  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleClientRepository)
    private repository: IGoogleClientRepository,
  ) {}

  /**
   * Authorize Google Users in Google client service.
   * P.S: If "clientId" not given then the first
   * Google client service will be used.
   * @param options
   * @return {Promise<string | OAuth2Client>} Instance of OAuth2Client or URL to authorize client server to access user.
   * @author Eric Ambiel
   * @throws Case something wrong throw a URL to authorize client server to access user.
   *
   */
  async execute(options: AuthorizeGoogleClientServerOption): Promise<void> {
    let oAuth2Client: OAuth2Client;

    if (options.clientId)
      oAuth2Client = this.repository.findById(options.clientId);
    else
      oAuth2Client = this.repository.findById(
        this.repository.list()[0].web.client_id,
      );

    try {
      oAuth2Client.setCredentials(options.userToken);
      await oAuth2Client.refreshAccessToken(); // After refresh, set too.
    } catch (err) {
      console.error(
        `Re-authentication is needed, same thing wrong with Client credentials: ${err}`,
      );
      throw Error(this.getAuthUrl(oAuth2Client));
    }
  }

  private getAuthUrl(oAuth2Client: OAuth2Client) {
    return this.googleAPI.getAuthUrl(oAuth2Client, {
      askPermission: true,
      scopes: this.SCOPES,
    });
  }
}
