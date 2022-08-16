import 'reflect-metadata';

import { container } from 'tsyringe';
import { GoogleClientCredential } from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import { sleep } from '@shared/helpers/smallHelper';
import clientCredential from '../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';
import GetSpreadsheetService from './GetSpreadsheetService';

describe('Unit teste - GetSpreadsheetService', () => {
  let service: GetSpreadsheetService;

  const SPREAD_SHEET = '16UHClMZfSwXvDPECG1oerd-pfD-pWC5cugrotqq_TQQ';
  const RANGE = 'Horas!A2:G';
  const GUSER = '108866897033893388302';
  const CLIENT_ID =
    '331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com';

  const {
    web: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [RedirectUri],
    },
  } = <GoogleClientCredential>clientCredential;

  beforeAll(() => {
    container.register('tokensPath', { useValue: 'src/misc/tokens' });

    container.registerInstance(
      OAuth2Client,
      new OAuth2Client(clientId, clientSecret, RedirectUri),
    );

    service = container.resolve(GetSpreadsheetService);
  });

  it('Should be possible get a Spreadsheet', async () => {
    await sleep(50);

    const sheet = await service.execute({
      sub: GUSER,
      clientId: CLIENT_ID,
      range: RANGE,
      spreadsheetId: SPREAD_SHEET,
    });

    console.table(sheet);
  });
});
