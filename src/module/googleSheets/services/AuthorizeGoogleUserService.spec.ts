import 'reflect-metadata';
import { container } from 'tsyringe';
import { GoogleServiceCredential } from '@shared/facades/GoogleServicesFacade';

import { Credentials } from 'google-auth-library';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import AuthorizeGoogleUserService from './AuthorizeGoogleUserService';

describe('Unit test - AuthorizeGoogleUserService.ts', () => {
  let authorizeGoogleUserService: AuthorizeGoogleUserService;
  let serviceCredentials: GoogleServiceCredential;
  let filesHandlerHelper: FilesHandlerHelper;
  let userToken: Credentials;

  beforeAll(async () => {
    authorizeGoogleUserService = container.resolve(AuthorizeGoogleUserService);
    filesHandlerHelper = container.resolve(FilesHandlerHelper);

    const loadedCredentials = await filesHandlerHelper.loadCredentialsFiles({
      credentialFilePath: 'src/misc/credentials.json', // TODO: Use path to check correct OS directory
      tokensPath: 'src/misc', // TODO: Use path to check correct OS directory
      accessToken: await import('../../../misc/token.json').then(
        token => token.access_token,
      ),
    });

    // spreadsheet: {
    //   spreadsheetId: '16UHClMZfSwXvDPECG1oerd-pfD-pWC5cugrotqq_TQQ',
    //       range: 'Horas!A2:G',
    // }

    serviceCredentials = loadedCredentials.serviceCredentials;
    userToken = loadedCredentials.token;
  });

  it('Should be possible return authorize a Google User', async () => {
    const spreadsheet = await authorizeGoogleUserService.execute({
      serviceCredentials,
      userToken,
    });

    // TODO: need to complete test

    console.log(spreadsheet);
  });
});
