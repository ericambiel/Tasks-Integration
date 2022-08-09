import 'reflect-metadata';
import { container } from 'tsyringe';
import {
  GoogleServiceCredential,
  Option,
} from '@shared/facades/GoogleSheetsFacade';
import Buffer from 'buffer';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { Credentials } from 'google-auth-library';
import GetSheetFromDocsService from './GetSheetFromDocsService';

type LoadCredentialsFilesOption = {
  /** Path to credentials file */
  credentialFilePath: string;
  /**
   *  The path to the user's access and refresh tokens. P.S it will be
   *  created automatically when the authorization flow completes for the first time.
   */
  tokensPath: Option['tokensPath'];
  /** A token that can be sent to a Google API */
  accessToken: Credentials['access_token'];
};

async function loadCredentialsFiles(options: LoadCredentialsFilesOption) {
  const filesHandlerHelper = container.resolve(FilesHandlerHelper);
  // Load client secrets from a local file.
  const credentialsFileBuffer: Buffer = await filesHandlerHelper
    .readFile(`${options.credentialFilePath}`) // TODO: Use path to verify correct S.O.
    .catch((e: Error) => {
      throw new Error(`Loading client secret file: ${e}`);
    });

  // Load previously stored a token.
  const tokenFileBuffer = await filesHandlerHelper.readFile(
    `${options.tokensPath}/token.json`,
    // `${options.credentialFilePath}/${options.accessToken}.json`, // TODO: Use path to verify correct S.O.
  );

  // Parse stored token
  const token: Credentials = JSON.parse(tokenFileBuffer.toString()); // TODO: Verify type of file, use JOY/Celebrate

  // Parse stored credential
  const credentials: GoogleServiceCredential = JSON.parse(
    credentialsFileBuffer.toString(),
  );

  return { credentials, token };
}

describe('Unit test - GetSheetFromDocsService.ts', () => {
  let service: GetSheetFromDocsService;
  let credentials: GoogleServiceCredential;
  let token: Credentials;

  beforeAll(async () => {
    container.register<Option>('googleSheetsFacadeOptions', {
      useValue: { tokensPath: './misc/token' },
    });

    service = container.resolve(GetSheetFromDocsService);

    const loadedCredentials = await loadCredentialsFiles({
      credentialFilePath: 'src/misc/credentials.json', // TODO: Use path to check correct OS directory
      tokensPath: 'src/misc', // TODO: Use path to check correct OS directory
      accessToken: await import('../../../misc/token.json').then(
        tkn => tkn.access_token,
      ),
    });

    credentials = loadedCredentials.credentials;
    token = loadedCredentials.token;
  });

  it('Should be possible return a selected spreadsheet', async () => {
    const spreadsheet = await service.execute({
      spreadsheet: {
        spreadsheetId: '16UHClMZfSwXvDPECG1oerd-pfD-pWC5cugrotqq_TQQ',
        range: 'Horas!A2:G',
      },
      serviceCredentials: credentials,
      userToken: token,
    });

    console.log(spreadsheet);
  });
});
