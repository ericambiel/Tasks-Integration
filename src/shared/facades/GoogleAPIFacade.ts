import IGoogleSheetsFacade from '@shared/facades/IGoogleSheetsFacade';
import { Credentials, LoginTicket, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { GenerateAuthUrlOpts } from 'google-auth-library/build/src/auth/oauth2client';
import { arrayArrayToObjArrayHead } from '@shared/helpers/smallHelper';
import { UserTokenInfo } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import ContainerManagerHelper from '@shared/helpers/ContainerManagerHelper';

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
   *  @example 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   */
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' | string;
  /**
   *  Range of columns and rows
   *  @example Class Data!A2:E
   */
  range: 'Class Data!A2:E' | string;
  /**
   * Array of Array values, direct from Google without treat to Array of Obj
   */
  arrayArray?: true;
};

export type GetAuthUrlOption = {
  /** @type {GenerateAuthUrlOpts.scope} */
  scopes:
    | GenerateAuthUrlOpts['scope']
    | [
        'https://www.googleapis.com/auth/spreadsheets.readonly', // Needed to access spreadsheet
        'https://www.googleapis.com/auth/userinfo.profile', // Get same information from profile, like user_id
      ];
  /** Prompt permission even if had it already, useful to get "refresh_token" again */
  askPermission?: true;
};

@singleton()
export default class GoogleAPIFacade
  extends ContainerManagerHelper
  implements IGoogleSheetsFacade
{
  constructor(
    @inject(FilesHandlerHelper)
    private filesHandlerHelper: FilesHandlerHelper,
  ) {
    super();
  }

  /**
   * Create an OAuth2 client with the given credentials. Use clientId
   * to locate instance in tsyringe
   * P.S. if given only client credentials need set token before.
   * @param serviceCredentials The authorization client credentials.
   * @author Eric Ambiel
   */
  oAuth2ClientFactor(serviceCredentials: GoogleClientCredential): OAuth2Client {
    const {
      client_secret: clientSecret,
      client_id: clientId,
      redirect_uris: redirectURIs,
    } = serviceCredentials.web;
    const oAuth2Client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri: redirectURIs[0],
      forceRefreshOnFailure: true,
      eagerRefreshThresholdMillis: 3300000, // Refresh user token every 55 minutes
    });

    super.container.registerInstance<OAuth2Client>(clientId, oAuth2Client);

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
  ): Promise<UserTokenInfo['user_information']> {
    return oAuth2Client.getTokenInfo(accessToken).then();
  }

  verifyUserToken(
    oAuth2Client: OAuth2Client,
    idToken: string,
  ): Promise<LoginTicket> {
    return oAuth2Client.verifyIdToken({
      idToken,
      // eslint-disable-next-line no-underscore-dangle
      audience: oAuth2Client._clientId,
    });
  }

  /**
   * Get values from spreadsheet:
   * @param oAuth2Client The authenticated Google OAuth client.
   * @param options
   */
  getSpreadSheetValues(
    oAuth2Client: OAuth2Client,
    options: GetSpreadSheetValuesOption,
  ) {
    const sheets = google.sheets({ version: 'v4', auth: <never>oAuth2Client }); // TODO: Type OAuth2Client doesn't work here

    return new Promise<[][] | Record<string, string>[]>((resolve, reject) => {
      sheets.spreadsheets.values.get(
        {
          // majorDimension: 'ROWS', // default
          spreadsheetId: options.spreadsheetId,
          range: options.range,
        },
        (err, res) => {
          const rows = res?.data.values;

          if (err) reject(new Error(`The API returned an error: ${err}`));

          if (rows?.length)
            resolve(
              options.arrayArray
                ? rows
                : arrayArrayToObjArrayHead(rows, { undefinedTo: null }),
            );

          reject(new Error('No data found.'));
        },
      );
    });
  }
}
