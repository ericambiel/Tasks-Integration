import 'reflect-metadata';

import { container } from 'tsyringe';
import GetMinimumRequiredToWorkflowService, {
  NameFnEnum,
} from '@modules/fluig/services/GetMinimumRequiredToWorkflowService';
import { authorizeUserAxiosFluig } from '@shared/__test__/helper.test';
import { Axios } from 'axios';

describe('Unit test - GetMinimumRequiredToWorkflow', () => {
  let service: GetMinimumRequiredToWorkflowService;

  beforeAll(async () => {
    const axios = await authorizeUserAxiosFluig();
    container.registerInstance(Axios, axios);
    service = container.resolve(GetMinimumRequiredToWorkflowService);
  });

  it('Should be possible get Manager from OP or OM', async () => {
    await service.execute('1000204', NameFnEnum.OM);
  });
});
