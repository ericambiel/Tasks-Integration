import 'reflect-metadata';

import { container } from 'tsyringe';
import AuthorizeFluigUserService from '@modules/fluig/services/AuthorizeFluigUserService';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import { registerAxiosCleanInstanceFluigTest } from '@shared/__test__/helper.test';

describe('Unit test - AuthorizeUserService', () => {
  let service: AuthorizeFluigUserService;
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
  };

  beforeAll(() => {
    registerAxiosCleanInstanceFluigTest();

    repository = container.resolve<IFluigUserRepository>(FluigUserRepository);

    service = container.resolve(AuthorizeFluigUserService);
  });

  it('Should be possible authorize user in Fluig', async () => {
    await service.execute(
      process.env.FLUIG_USERNAME ?? '',
      process.env.FLUIG_PASSWORD ?? '',
    );

    // TODO: Create schema and use Joy to validade exactly kinds values(Useful to be used on celebrate too)
    expect(repository.list()).toEqual<IFluigUserModel[]>([fluigUserSchema]);
  });
});
