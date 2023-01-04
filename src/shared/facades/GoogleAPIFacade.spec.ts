import 'reflect-metadata';
import { container } from 'tsyringe';
import GoogleAPIFacade, {
  GDriveMINEEnum,
} from '@shared/facades/GoogleAPIFacade';
import { Credentials, OAuth2Client } from 'google-auth-library';

import { UserTokenInfoType } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import GoogleUserInformationModel from '@modules/googleSheets/infra/local/models/GoogleUserInformationModel';
import CLIENT_SECRET from '../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';
import userToken from '../../misc/tokens/108866897033893388302.token.json';

describe('Unit Test - GoogleAPIFacade', () => {
  let googleServiceFacade: GoogleAPIFacade;
  let oAuth2Client: OAuth2Client;
  let newTokenInfoUser: UserTokenInfoType;

  // TODO: Create schema and use Joy to validade exactly type values(Useful to be used on celebrate too)
  const userTokenInfoSchema: UserTokenInfoType = {
    refresh_token: expect.any(String),
    scope: expect.any(String),
    token_type: 'Bearer',
    id_token: expect.any(String),
    expiry_date: expect.any(Number),
    user_information: {
      sub: expect.any(String),
    },
  };

  beforeAll(() => {
    googleServiceFacade = container.resolve(GoogleAPIFacade);
  });

  it('Should be possible create an OAuth2Client', async () => {
    oAuth2Client = googleServiceFacade.oAuth2ClientFactor(CLIENT_SECRET);
  });

  it('Should be possible get new token using getTokenInformation', async () => {
    /** Get this code by running AuthorizeGoogleUserService.spec */
    const validationTokenCode =
      '4/0ARtbsJo_ORBNlNdkVpjoLTpsfo3i2YiKN3QYnzZdpPzwVaMnMny065UwiLLxLLSu6USmHg';

    const newToken: Credentials = await googleServiceFacade.getNewToken(
      oAuth2Client,
      validationTokenCode,
    );

    const tokenInfo: GoogleUserInformationModel =
      await googleServiceFacade.getTokenInformation(
        oAuth2Client,
        newToken.access_token ?? '',
      );

    newTokenInfoUser = {
      ...newToken,
      user_information: tokenInfo,
    };

    expect(newTokenInfoUser).toMatchObject<UserTokenInfoType>(
      userTokenInfoSchema,
    );
  });

  it('Should be possible list specifics files by criteria', async () => {
    oAuth2Client.setCredentials({ refresh_token: userToken.refresh_token });

    const files = await googleServiceFacade.findFilesDrive(oAuth2Client, {
      mimeType: GDriveMINEEnum.spreadsheet,
      name: 'Apontamento Horas',
    });

    expect(files).toContainEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      }),
    );
  });
});
