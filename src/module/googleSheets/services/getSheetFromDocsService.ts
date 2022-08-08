import { container, inject } from 'tsyringe';
import GoogleSheetsFacade, {
  GoogleUserCredential,
  GoogleUserToken,
} from '@shared/facades/GoogleSheetsFacade';
import Buffer from 'buffer';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { OAuth2Client } from 'google-auth-library';

export default class GetSheetFromDocsService {
  constructor(
    @inject(GoogleSheetsFacade)
    private googleSheet: GoogleSheetsFacade,
    @inject(FilesHandlerHelper)
    private filesHandlerHelper: FilesHandlerHelper,
  ) {}

  /**
   * Authorize client with credentials
   * @param instanceId instance ID of OAuth2Client
   */
  async execute(instanceId: string) {
    const { credentials, token } = await this.loadCredentialsFiles();

    // If token doesn't exist return an authentication token request
    if (token === '') {
      console.log('Generate a new token');

      const newInstanceId = this.googleSheet.clientFactor(credentials);
      const oAuthClient = container.resolve<OAuth2Client>(newInstanceId);
      oAuthClient.setCredentials(token);

      const url = this.googleSheet.getAuthUrl(oAuthClient, [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ]);

      return { url, newInstanceId };
    }

    // Else set loaded token
    const oAuthClient = container.resolve<OAuth2Client>(instanceId);
    oAuthClient.setCredentials(token);

    // Get all values from Sheet
    return this.googleSheet.getSpreadSheetValues(oAuthClient);
  }

  private async loadCredentialsFiles() {
    // Load client secrets from a local file.
    const credentialsFileBuffer: Buffer = await this.filesHandlerHelper // TODO: Inject from .env
      .readFile('credentials.json')
      .catch((e: Error) => {
        throw new Error(`Error loading client secret file: ${e}`);
      });

    // Load previously stored a token.
    const tokenFileBuffer = await this.filesHandlerHelper.readFile('token.jso'); // TODO: Inject from .env

    // Parse stored token
    const token: GoogleUserToken = JSON.parse(tokenFileBuffer.toString()); // TODO: Verify type of file, use JOY/Celebrate

    // Parse stored credential
    const credentials: GoogleUserCredential = JSON.parse(
      credentialsFileBuffer.toString(),
    );

    return { credentials, token };
  }
}
