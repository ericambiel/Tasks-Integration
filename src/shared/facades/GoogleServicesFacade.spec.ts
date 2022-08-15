import 'reflect-metadata';
import { container } from 'tsyringe';
import GoogleServicesFacade from '@shared/facades/GoogleServicesFacade';
import { OAuth2Client } from 'google-auth-library';

import CLIENT_SECRET from '../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';
import { UserTokenInfo } from '../../module/googleSheets/infra/local/repositories/IGoogleUserRepository';

describe('Unit Test - GoogleSeviceFacade', () => {
  let googleServiceFacade: GoogleServicesFacade;
  let oAuthClient: OAuth2Client;

  /** Get this code by running AuthorizeGoogleUserService.spec */
  const validationTokenCode =
    '4/0AdQt8qgdTphw7k0Hfok3TpJjXDsSctG2m2kxGEWtzCurhWR1_PYUz1qs2rvHbLOSlr5Ptw';

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
    googleServiceFacade = container.resolve(GoogleServicesFacade);
  });

  it('Should be possible create an OAuth2Client', async () => {
    oAuthClient = googleServiceFacade.clientFactor(CLIENT_SECRET);
  });

  it('Should be possible get new token to Google User', async () => {
    const newToken = await googleServiceFacade.getNewToken(
      oAuthClient,
      validationTokenCode,
    );

    const tokenInfo = await googleServiceFacade.getTokenInformation(
      oAuthClient,
      newToken.access_token!,
    );

    const newTokenInfoUser: UserTokenInfo = {
      ...newToken,
      token_info: tokenInfo,
    };

    expect(newTokenInfoUser).toMatchObject<UserTokenInfo>(userTokenInfoSchema);
  });
});