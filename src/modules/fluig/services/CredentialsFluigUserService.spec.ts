import 'reflect-metadata';

import { container } from 'tsyringe';
import CredentialsFluigUserService from '@modules/fluig/services/CredentialsFluigUserService';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { registerAxiosCleanInstanceFluigTester } from '@shared/__test__/helper.test';
import FluigUserInfoModel from '@modules/fluig/infra/local/models/FluigUserInfoModel';

describe('Unit test - CredentialsFluigUserService', () => {
  let service: CredentialsFluigUserService;
  let repository: IFluigUserRepository;

  // TODO: Create schema and use Joy to validade exactly kinds values(Useful to be used on celebrate too)
  const fluigUserSchema: IFluigUserModel = {
    sub: expect.any(String),
    role: expect.any(String),
    tenant: expect.any(Number),
    userTenantId: expect.any(Number),
    userType: expect.any(Number),
    userUUID: expect.any(String),
    tenantUUID: expect.any(String),
    lastUpdateDate: expect.any(Number),
    userTimeZone: expect.any(String),
    userInfo: expect.any(FluigUserInfoModel),
  };

  beforeAll(() => {
    registerAxiosCleanInstanceFluigTester();

    repository = container.resolve<IFluigUserRepository>(FluigUserRepository);

    service = container.resolve(CredentialsFluigUserService);
  });

  // TODO: FIX this test
  it('Should be possible get User Credential', async () => {
    await service.execute(
      process.env.FLUIG_USERNAME ?? '',
      process.env.FLUIG_PASSWORD ?? '',
    );

    // TODO: Create schema and use Joy to validade exactly kinds values(Useful to be used on celebrate too)
    expect(repository.list()).toEqual<IFluigUserModel[]>([fluigUserSchema]);
  });
});