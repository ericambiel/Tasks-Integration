import { Credentials, OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { GenerateAuthUrlOpts } from 'google-auth-library/build/src/auth/oauth2client';
import { arrayArrayToObjArrayHead } from '@shared/helpers/smallHelper';
import { UserTokenInfo } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import ContainerManagerHelper from '@helpers/ContainerManagerHelper';

/** @author Eric Ambiel */
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

/** @author Eric Ambiel */
// eslint-disable-next-line no-shadow
export enum GDriveMINEEnum {
  audio = 'application/vnd.google-apps.audio',
  /** Google Docs */
  document = 'application/vnd.google-apps.document',
  /** 3rd party shortcut */
  driveSdk = 'application/vnd.google-apps.drive-sdk',
  drawing = 'application/vnd.google-apps.drawing', // Google Drawing
  file = 'application/vnd.google-apps.file', // Google Drive file
  folder = 'application/vnd.google-apps.folder', // Google Drive folder
  form = 'application/vnd.google-apps.form', // Google Forms
  fusiontable = 'application/vnd.google-apps.fusiontable', // Google Fusion Tables
  jam = 'application/vnd.google-apps.jam', // Google Jamboard
  map = 'application/vnd.google-apps.map', // Google My Maps
  photo = 'application/vnd.google-apps.photo',
  presentation = 'application/vnd.google-apps.presentation', // Google Slides
  script = 'application/vnd.google-apps.script', // Google Apps Scripts
  shortcut = 'application/vnd.google-apps.shortcut', // Shortcut
  site = 'application/vnd.google-apps.site', // Google Sites
  /** Google Sheets */
  spreadsheet = 'application/vnd.google-apps.spreadsheet',
  video = 'application/vnd.google-apps.video',
  unknown = 'application/vnd.google-apps.unknown',
}

/** @author Eric Ambiel */
type FindSpreadsheetOption = {
  /** MIME type file */
  mimeType: GDriveMINEEnum | string;
  /** Name of file to find in */
  name?: string;
  /** Get all metadata values from files */
  allMetadata?: true;
};

/** @author Eric Ambiel */
export type GetSpreadsheetValuesOption = {
  /**
   *  Spread Sheet ID. You can get it from you google sheet URL
   *  @example 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   */
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' | string;
  /**
   *  Range of columns and rows
   *  @example
   *  'Class Data!A2:E'
   */
  range: 'Class Data!A2:E' | string;
  // /**
  //  * Array of Array values, direct from Google without treat to Array of Obj
  //  */
  // arrayArray?: true;
};

/** @author Eric Ambiel */
export type MinimumScopesType = [
  'https://www.googleapis.com/auth/userinfo.profile', // Get same information from profile, like user_id
  'https://www.googleapis.com/auth/spreadsheets.readonly', // Needed to access spreadsheet
  'https://www.googleapis.com/auth/drive.metadata.readonly', // Get Drive file name, used to find Spreadsheet
];

/** @author Eric Ambiel */
type GetAuthUrlOption = {
  /** @type {GenerateAuthUrlOpts.scope} */
  scopes: GenerateAuthUrlOpts['scope'] | MinimumScopesType;
  /** Prompt permission even if had it already, useful to get "refresh_token" again */
  askPermission?: true;
};

/** @author Eric Ambiel */
@singleton()
export default class GoogleAPIFacade extends ContainerManagerHelper {
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

  /**
   * Get values from spreadsheet:
   * @param oAuth2Client The authenticated Google OAuth client.
   * @param options
   */
  getSpreadSheetArrayArray(
    oAuth2Client: OAuth2Client,
    options: GetSpreadsheetValuesOption,
  ) {
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

    return new Promise<string[][]>((resolve, reject) => {
      sheets.spreadsheets.values.get(
        {
          // majorDimension: 'ROWS', // default
          spreadsheetId: options.spreadsheetId,
          range: options.range,
        },
        (err, res) => {
          const rows = <string[][]>res?.data.values;

          if (err) reject(new Error(`The API returned an error: ${err}`));

          if (rows?.length)
            resolve(
              rows,
              // options.arrayArray
              //   ? rows
              //   : arrayArrayToObjArrayHead<T>(rows, {
              //       undefinedTo: null,
              //     }),
            );

          reject(new Error('No data found.'));
        },
      );
    });
  }

  /**
   * Transform arrayArray spreadsheet
   * on typed ArrayObject array
   * @param oAuth2Client
   * @param options
   */
  async getSpreadSheetValuesArrayObj<T>(
    oAuth2Client: OAuth2Client,
    options: GetSpreadsheetValuesOption,
  ) {
    const spreadsheet = await this.getSpreadSheetArrayArray(
      oAuth2Client,
      options,
    );

    // TODO: Verify with celebrate if given generic type is correct transformed
    return arrayArrayToObjArrayHead<T>(spreadsheet, {
      undefinedTo: null,
    });
  }

  /**
   * Search file in drive location
   * @return{obj} data file
   */
  async findFilesDrive(
    oAuth2Client: OAuth2Client,
    options?: FindSpreadsheetOption,
  ) {
    const service = google.drive({ version: 'v3', auth: oAuth2Client });
    let filter;
    let fields;

    if (options) {
      const { mimeType, name } = options;

      filter = `${mimeType ? `mimeType:'${mimeType}'` : ''}${
        name ? ` AND name:'${name}'` : ''
      }`;

      fields = options.allMetadata ? '*' : 'nextPageToken, files(id, name)';
    }

    const res = await service.files.list({
      q: filter,
      fields,
      spaces: 'drive',
    });

    if (!res.data.files)
      throw new Error('There is no files with search options');

    // res.data.files.forEach(file => console.log('Found file:', file));

    return res.data.files;
  }

  // TODO: Use google.drive.watch to subscribe sheet, waiting for changes
}
