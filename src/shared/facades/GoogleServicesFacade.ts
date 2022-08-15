import IGoogleSheetsFacade from '@shared/facades/IGoogleSheetsFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { container, inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { GenerateAuthUrlOpts } from 'google-auth-library/build/src/auth/oauth2client';
import { UserTokenInfo } from '../../module/googleSheets/infra/local/repositories/IGoogleUserRepository';

export type GoogleClientCredential = {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
    javascript_origins: string[];
  };
};

export type GetSpreadSheetValuesOption = {
  /**
   *  Spread Sheet ID. You can get it from you google sheet URL
   *  @example 16UHClMZfSwXvDPECG1oerd-pfD-pWC5cugrotqq_TQQ
   */
  spreadsheetId: string;
  /**
   *  Range of columns and rows
   *  @example Horas!A2:G
   */
  range: string;
};

export type GetAuthUrlOption = {
  /** @type {GenerateAuthUrlOpts.scope} */
  scopes:
    | GenerateAuthUrlOpts['scope']
    | [
        'https://www.googleapis.com/auth/spreadsheets.readonly', // Need to access spreadsheet
        'https://www.googleapis.com/auth/userinfo.profile', // Get same information from profile, like user_id
      ];
  /** Prompt permission even if had it already, useful to get "refresh_token" again */
  askPermission?: true;
};

@singleton()
export default class GoogleServicesFacade implements IGoogleSheetsFacade {
  constructor(
    @inject(FilesHandlerHelper)
    private filesHandlerHelper: FilesHandlerHelper,
  ) {}

  /**
   * Create an OAuth2 client with the given credentials.
   * P.S. if given only client credentials need set token before.
   * @param serviceCredentials The authorization client credentials.
   */
  clientFactor(serviceCredentials: GoogleClientCredential): OAuth2Client {
    const {
      client_secret: clientSecret,
      client_id: clientId,
      redirect_uris: redirectURIs,
    } = serviceCredentials.web;
    const oAuth2Client = new OAuth2Client(
      clientId,
      clientSecret,
      redirectURIs[0],
    );

    container.registerInstance<OAuth2Client>(clientId, oAuth2Client);

    return oAuth2Client;
  }

  getAuthUrl(oAuth2Client: OAuth2Client, options: GetAuthUrlOption): string {
    const authUrl = oAuth2Client.generateAuthUrl({
      scope: options.scopes,
      prompt: options.askPermission ? 'consent' : undefined, // 'consent' prompt permissions and get refresh_token again,
      access_type: 'offline',
      include_granted_scopes: true, // Enable incremental authorization. Recommended as a best practice.
    });

    console.log('Authorize this app by visiting this url: \n', authUrl);

    return authUrl;
  }

  /**
   * Get user token given client
   * @param oAuth2Client The OAuth2 client to get token for.
   * @param code Authorized code for get token
   */
  async getNewToken(
    oAuth2Client: OAuth2Client,
    code: string,
  ): Promise<Credentials> {
    // Generate new token
    return new Promise<Credentials>((resolve, reject) => {
      oAuth2Client.getToken(code, async (err, token) => {
        if (err)
          reject(
            new Error(`Error while trying to retrieve access token: ${err}`),
          );

        if (token) resolve(token);

        reject(new Error(`Token is null or undefined`));
      });
    });
  }

  /**
   * Get more information given a client authenticated with user token
   * @param oAuth2Client
   * @param accessToken
   */
  getTokenInformation(
    oAuth2Client: OAuth2Client,
    accessToken: string,
  ): Promise<UserTokenInfo['token_info']> {
    return oAuth2Client.getTokenInfo(accessToken).then();
  }

  /**
   * Prints values from spreadsheet:
   * @param oAuth2Client The authenticated Google OAuth client.
   * @param options
   */
  getSpreadSheetValues(
    oAuth2Client: OAuth2Client,
    options: GetSpreadSheetValuesOption,
  ) {
    const sheets = google.sheets({ version: 'v4', auth: <never>oAuth2Client }); // TODO: Type OAuth2Client doesn't work here

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get(
        {
          spreadsheetId: options.spreadsheetId,
          range: options.range,
        },
        (err, res) => {
          const rows = res?.data.values;

          if (err) reject(new Error(`The API returned an error: ${err})`));

          // if (rows?.length) rows.forEach(row => console.log(`${row}`));
          if (rows?.length) resolve(rows);

          reject(new Error('No data found.'));
        },
      );
    });
  }
}