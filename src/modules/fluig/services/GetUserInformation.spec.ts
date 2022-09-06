import 'reflect-metadata';

import { authorizeUserAxiosFluigTester } from '@shared/__test__/helper.test';
import { container } from 'tsyringe';
import { Axios } from 'axios';
import GetUserInformation from '@modules/fluig/services/GetUserInformation';

describe('Unit test - GetUserInformation', () => {
  let service: GetUserInformation;

  beforeAll(async () => {
    const axios = await authorizeUserAxiosFluigTester();
    container.registerInstance(Axios, axios);
    service = container.resolve(GetUserInformation);
  });

  it('Should be possible get user information from Fluig', async () => {
    console.log(await service.execute('ambiele'));
  });
});
