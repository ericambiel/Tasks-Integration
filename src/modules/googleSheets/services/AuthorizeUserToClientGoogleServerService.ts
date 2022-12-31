import { inject, singleton } from 'tsyringe';
import GoogleAPIFacade, {
  MinimumScopesType,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import ConsoleLog from '@libs/ConsoleLog';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';

type AuthorizeGoogleClientServerOption = {
  /** Google user SUB, acquired from token-info */
  userSUB: string;
  /** Client ID instance */
  clientId: string;
};

/**
 * @author Eric Ambiel
 */
@singleton()
export default class AuthorizeUserToClientGoogleServerService {
  private readonly SCOPES: MinimumScopesType = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
  ];

  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleClientRepository)
    private clientRepository: IGoogleClientRepository,
    @inject(GoogleUserRepository)
    private userRepository: GoogleUserRepository,
  ) {}

  /**
   * Authorize Google Users in Google client service.
   * @param options
   * @return {Promise<string | OAuth2Client>} Instance of OAuth2Client or URL to authorize client server to access user.
   * @author Eric Ambiel
   * @throws Case something wrong throw a URL to authorize client server to access user.
   *
   */
  async execute(options: AuthorizeGoogleClientServerOption): Promise<void> {
    const usrCredential = this.userRepository.findBySub(options.userSUB);

    const oAuth2Client: OAuth2Client = this.clientRepository.findById(
      options.clientId,
    );

    try {
      oAuth2Client.setCredentials(usrCredential);
      await oAuth2Client.refreshAccessToken(); // After refresh, set too.
    } catch (err) {
      ConsoleLog.print(
        `Re-authentication needed, same thing wrong with Client credentials: ${err}`,
        'error',
        'GOOGLECLIENTAUTH',
      );
      throw ConsoleLog.print(
        this.getAuthUrl(oAuth2Client),
        'error',
        'GOOGLECLIENTAUTH',
      );
    }
  }

  private getAuthUrl(oAuth2Client: OAuth2Client) {
    return this.googleAPI.getAuthUrl(oAuth2Client, {
      askPermission: true,
      scopes: this.SCOPES,
    });
  }
}
