import 'reflect-metadata';

import { container } from 'tsyringe';
import { GoogleClientCredentialType } from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import { sleep } from '@shared/helpers/smallHelper';
import clientCredential from '../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';
import userToken from '../../../misc/tokens/108866897033893388302.token.json';
import GetWorksheetService from './GetWorksheetService';

describe('Unit teste - GetWorksheetService', () => {
  let service: GetWorksheetService;

  const SPREAD_SHEET = '1uYLY1xtGQRqPeaUMzzmuVM5vb_fYP8qwDjiS1rb0EjE';
  const RANGE = 'Horas!A2:H';

  const {
    web: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
    },
  } = <GoogleClientCredentialType>clientCredential;

  beforeAll(() => {
    const oAuth2Client = new OAuth2Client({
      clientId,
      clientSecret,
      redirectUri,
      // forceRefreshOnFailure: true,
    });
    oAuth2Client.setCredentials({ refresh_token: userToken.refresh_token });

    container.registerInstance(OAuth2Client, oAuth2Client);

    service = container.resolve(GetWorksheetService);
  });

  it('Should be possible get a Worksheet', async () => {
    await sleep(50);

    const sheet = await service.execute('ClientIDHere', {
      range: RANGE,
      spreadsheetId: SPREAD_SHEET,
    });

    console.table(sheet);
  });
});
