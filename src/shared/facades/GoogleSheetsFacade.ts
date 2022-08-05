import IGoogleSheetsFacade from '@shared/facades/IGoogleSheetsFacade';
import * as fs from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as readline from 'readline';
import * as Buffer from 'buffer';

// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// const TOKEN_PATH = 'token.json';
// const SPREAD_SHEET = '16UHClMZfSwXvDPECG1oerd-pfD-pWC5cugrotqq_TQQ';
// const RANGE = 'Horas!A2:G';

type GoogleCredential = {
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

type Option = {
  /**
   *  The file token.json stores the user's access and refresh tokens, and is
   *  created automatically when the authorization flow completes for the first time.
   */
  tokenPathFile: string;
  /** Define scope to use. P.S. If modifying these scopes, delete token file */
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly' | string];
  spreadsheetId: string;
  range: string;
};

export default class GoogleSheetsFacade implements IGoogleSheetsFacade {
  constructor(private options: Option) {}

  async main() {
    // Load client secrets from a local file.
    const credentialsFileBuffer: Buffer = await readFile(
      'credentials.json',
    ).catch(e => {
      throw new Error(`Error loading client secret file: ${e}`);
    });

    // Authorize a client with credentials, then call the Google Sheets API.
    const authorization = await this.authorize(
      JSON.parse(credentialsFileBuffer.toString()),
    );

    this.getSpreadSheetValues(authorization);
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param credentials The authorization client credentials.
   * //@param {function} callback The callback to call with the authorized client.
   */
  async authorize(credentials: GoogleCredential): Promise<OAuth2Client> {
    let token: Credentials;
    // eslint-disable-next-line camelcase
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client(
      client_id,
      client_secret,
      // eslint-disable-next-line camelcase
      redirect_uris[0],
    );

    // Load previously stored a token.
    const tokenFileBuffer = await readFile(this.options.tokenPathFile);

    // Parse stored token
    token = JSON.parse(tokenFileBuffer.toString()); // TODO: Verify type of file, use JOY/Celebrate

    if (token === '') {
      console.log('Generate a new token');
      token = await this.getNewToken(oAuth2Client);
    }

    oAuth2Client.setCredentials(token);

    return oAuth2Client;
  }

  private generateAuthUrl(oAuth2Client: OAuth2Client): string {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.options.scopes,
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param oAuth2Client The OAuth2 client to get token for.
   * //@param {getEventsCallback} callback The callback for the authorized client.
   */
  async getNewToken(oAuth2Client: OAuth2Client): Promise<Credentials> {
    const authUrl = this.generateAuthUrl(oAuth2Client);
    console.log('Authorize this app by visiting this url: /n', authUrl);

    const code: string = await promptQuestion(
      'Enter the code from that page here: ',
    );

    // Generate new token
    return new Promise<Credentials>((resolve, reject) => {
      oAuth2Client.getToken(code, async (err, token) => {
        if (err)
          reject(
            new Error(`Error while trying to retrieve access token: ${err}`),
          );

        if (token) {
          // Store the token to disk for later program executions
          await writeFile(this.options.tokenPathFile, JSON.stringify(token));
          resolve(token);
        }

        reject(new Error(`Token is null or undefined`));
      });
    });
  }

  /**
   * Prints values from spreadsheet:
   * @param auth The authenticated Google OAuth client.
   */
  getSpreadSheetValues(auth: OAuth2Client) {
    const sheets = google.sheets({ version: 'v4', auth: <never>auth }); // TODO: Type OAuth2Client doesn't work here
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: this.options.spreadsheetId,
        range: this.options.range,
      },
      (err, res) => {
        const rows = res?.data.values;

        if (err) return console.log(`The API returned an error: ${err}`);

        if (rows?.length) rows.forEach(row => console.log(`${row}`));
        return console.log('No data found.');
      },
    );
  }
}
