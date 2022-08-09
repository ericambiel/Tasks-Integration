import IGoogleSheetsFacade from '@shared/facades/IGoogleSheetsFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { container, inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import PromptConsoleHelper from '@shared/helpers/PromptConsoleHelper';
import { randomUUID } from 'crypto';
import { GenerateAuthUrlOpts } from 'google-auth-library/build/src/auth/oauth2client';

// const TOKEN_PATH = 'token.json';

export type GoogleServiceCredential = {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: [string];
    javascript_origins: [string];
  };
};

export type Option = {
  /**
   *  The path to the user's access and refresh tokens. P.S it will be
   *  created automatically when the authorization flow completes for the first time.
   */
  tokensPath: string;
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
  scopes: GenerateAuthUrlOpts['scope'] &
    ['https://www.googleapis.com/auth/spreadsheets.readonly'];
};

@singleton()
export default class GoogleSheetsFacade implements IGoogleSheetsFacade {
  constructor(
    @inject('googleSheetsFacadeOptions')
    private options: Option,
    @inject(FilesHandlerHelper)
    private filesHandlerHelper: FilesHandlerHelper,
    @inject(PromptConsoleHelper)
    private promptConsoleHelper: PromptConsoleHelper, // TODO: Transfers responsibility to Service
  ) {}

  /**
   * Create an OAuth2 client with the given credentials.
   * P.S. if given only credentials need set credentials before with
   * token before.
   * @param serviceCredentials The authorization client credentials.
   */
  clientFactor(serviceCredentials: GoogleServiceCredential): string {
    const uuid = randomUUID();
    // eslint-disable-next-line camelcase
    const { client_secret, client_id, redirect_uris } = serviceCredentials.web;
    const oAuth2Client = new OAuth2Client(
      client_id,
      client_secret,
      // eslint-disable-next-line camelcase
      redirect_uris[0],
    );

    container.registerInstance<OAuth2Client>(uuid, oAuth2Client);

    return uuid;
  }

  getAuthUrl(oAuth2Client: OAuth2Client, options: GetAuthUrlOption): string {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: options.scopes,
    });

    console.log('Authorize this app by visiting this url: /n', authUrl);

    return authUrl;
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param oAuth2Client The OAuth2 client to get token for.
   * @param code Authorized code for get token
   */
  async getNewToken(
    oAuth2Client: OAuth2Client,
    code: string,
  ): Promise<Credentials> {
    // const authUrl = this.generateAuthUrl(oAuth2Client, this.options);

    // // TODO: Transfers responsibility to Service
    // const code: string = await this.promptConsoleHelper.promptQuestion(
    //   'Enter the code from that page here: ',
    // );

    // Generate new token
    return new Promise<Credentials>((resolve, reject) => {
      oAuth2Client.getToken(code, async (err, token) => {
        if (err)
          reject(
            new Error(`Error while trying to retrieve access token: ${err}`),
          );

        if (token) {
          // Store the token to disk for later program executions
          await this.filesHandlerHelper.writeFile(
            // eslint-disable-next-line no-underscore-dangle
            `${this.options.tokensPath}\\${token.access_token}`, // TODO: Apply Path resolve
            JSON.stringify(token),
          );
          resolve(token);
        }

        reject(new Error(`Token is null or undefined`));
      });
    });
  }

  /**
   * Prints values from spreadsheet:
   * @param authClient The authenticated Google OAuth client.
   * @param options
   */
  getSpreadSheetValues(
    authClient: OAuth2Client,
    options: GetSpreadSheetValuesOption,
  ) {
    const sheets = google.sheets({ version: 'v4', auth: <never>authClient }); // TODO: Type OAuth2Client doesn't work here

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
