import 'reflect-metadata';
import { container } from 'tsyringe';
import GoogleAPIFacade from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';

import { UserTokenInfo } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import CLIENT_SECRET from '../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';

describe('Unit Test - GoogleSeviceFacade', () => {
  let googleServiceFacade: GoogleAPIFacade;
  let oAuth2Client: OAuth2Client;

  /** Get this code by running AuthorizeGoogleUserService.spec */
  const validationTokenCode =
    '4/0AdQt8qgdTphw7k0Hfok3TpJjXDsSctG2m2kxGEWtzCurhWR1_PYUz1qs2rvHbLOSlr5Ptw';

  // TODO: Create schema and use Joy to validade exactly kinds values(Useful to be used on celebrate too)
  const userTokenInfoSchema: UserTokenInfo = {
    refresh_token: expect.any(String),
    scope: expect.any(String),
    token_type: 'Bearer',
    id_token: expect.any(String),
    expiry_date: expect.any(Number),
    token_info: {
      expiry_date: expect.any(Number),
      scopes: expect.arrayContaining([
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
      ]),
      azp: expect.any(String),
      aud: expect.any(String),
      sub: expect.any(String),
      exp: expect.any(String),
      access_type: 'offline',
    },
  };

  beforeAll(() => {
    googleServiceFacade = container.resolve(GoogleAPIFacade);
  });

  it('Should be possible create an OAuth2Client', async () => {
    oAuth2Client = googleServiceFacade.oAuth2ClientFactor(CLIENT_SECRET);
  });

  it('Should be possible get new token to Google User', async () => {
    const newToken = await googleServiceFacade.getNewToken(
      oAuth2Client,
      validationTokenCode,
    );

    const tokenInfo = await googleServiceFacade.getTokenInformation(
      oAuth2Client,
      newToken.access_token ?? '',
    );

    const newTokenInfoUser: UserTokenInfo = {
      ...newToken,
      token_info: tokenInfo,
    };

    expect(newTokenInfoUser).toMatchObject<UserTokenInfo>(userTokenInfoSchema);
  });
});
