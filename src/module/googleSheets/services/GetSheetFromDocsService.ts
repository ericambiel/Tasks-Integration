import { container, inject, injectable } from 'tsyringe';
import GoogleSheetsFacade, {
  GetSpreadSheetValuesOption,
  GoogleServiceCredential,
} from '@shared/facades/GoogleSheetsFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';

type GetSheetFromDocsServiceOption = {
  /**
   * instance ID of OAuth2Client
   */
  instanceId?: string;
  userToken?: Credentials;
  serviceCredentials: GoogleServiceCredential;
  spreadsheet: GetSpreadSheetValuesOption;
};

@injectable()
export default class GetSheetFromDocsService {
  constructor(
    @inject(GoogleSheetsFacade)
    private googleSheet: GoogleSheetsFacade,
  ) {}

  /**
   * Authorize client with credentials
   * @param options
   */
  async execute(options: GetSheetFromDocsServiceOption) {
    const { serviceCredentials, spreadsheet, userToken } = options;
    let { instanceId } = options;

    // Create instance if it doesn't exist
    if (!instanceId)
      instanceId = this.googleSheet.clientFactor(serviceCredentials);

    const oAuthClient = this.verifyInstanceExists(instanceId);

    // If token doesn't exist return an authentication token request
    if (!userToken) {
      console.log('Generate a new token');

      const url = this.googleSheet.getAuthUrl(oAuthClient, {
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      return { url, instanceId };
    }

    // Else set loaded token
    oAuthClient.setCredentials(userToken);

    // Get all values from Sheet
    return this.googleSheet.getSpreadSheetValues(oAuthClient, spreadsheet);
  }

  // TODO: Need todo ths function, verify if instance exists
  private verifyInstanceExists(instanceId: string) {
    return container.resolve<OAuth2Client>(instanceId);
  }
}
