import 'reflect-metadata';

import { container } from 'tsyringe';
import GetAuthorizationFluigUserService, {
  FluigCredentialsType,
} from '@modules/fluig/services/GetAuthorizationFluigUserService';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';

describe('Unit test - CredentialsFluigUserService', () => {
  let service: GetAuthorizationFluigUserService;

  // TODO: Create schema and use Joy to validade exactly kinds values(Useful to be used on celebrate too)
  const fluigCredentials: FluigCredentialsType = {
    jWTPayload: {
      sub: expect.any(String),
      role: expect.any(String),
      tenant: expect.any(Number),
      userTenantId: expect.any(Number),
      userType: expect.any(Number),
      userUUID: expect.any(String),
      tenantUUID: expect.any(String),
      lastUpdateDate: expect.any(Number),
      userTimeZone: expect.any(String),
      aud: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
    },
    headers: { Cookie: expect.any(String), Authorization: expect.any(String) },
  };

  beforeAll(() => {
    container.register<IFluigUserModel[]>('FluigUserModel', {
      useValue: [],
    });

    service = container.resolve(GetAuthorizationFluigUserService);
  });

  // TODO: FIX this test
  it('Should be possible get User Credential', async () => {
    const authorization = await service.execute(
      process.env.TEST_FLUIG_USERNAME ?? '',
      process.env.TEST_FLUIG_PASSWORD ?? '',
    );

    // TODO: Create schema and use Joy to validade exactly kinds values(Useful to be used on celebrate too)
    expect(authorization).toEqual<FluigCredentialsType>(fluigCredentials);
  });
});
