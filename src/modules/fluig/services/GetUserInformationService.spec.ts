import 'reflect-metadata';

import { authorizeUserAxiosFluigTester } from '@shared/__test__/helper.test';
import { container } from 'tsyringe';
import { Axios } from 'axios';
import GetUserInformationService from '@modules/fluig/services/GetUserInformationService';

describe('Unit test - GetUserInformation', () => {
  let service: GetUserInformationService;

  beforeAll(async () => {
    const axios = await authorizeUserAxiosFluigTester();
    container.registerInstance(Axios, axios);
    service = container.resolve(GetUserInformationService);
  });

  it('Should be possible get user information from Fluig', async () => {
    console.log(await service.execute('ambiele'));
  });
});
