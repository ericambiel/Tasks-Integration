import 'reflect-metadata';

import { container } from 'tsyringe';
import GetMinimumRequiredToWorkflowService, {
  NameFnEnum,
} from '@modules/fluig/services/GetMinimumRequiredToWorkflowService';
import { authorizedUserAxiosFluig } from '@shared/__test__/helper.test';
import { Axios } from 'axios';

describe('Unit test - GetMinimumRequiredToWorkflow', () => {
  let service: GetMinimumRequiredToWorkflowService;

  beforeAll(async () => {
    const axios = await authorizedUserAxiosFluig();
    container.registerInstance(Axios, axios);
    service = container.resolve(GetMinimumRequiredToWorkflowService);
  });

  it('Should be possible get Manager from OP or OM', async () => {
    const managers = await service.getManagerOMOP('1000204', NameFnEnum.OM);
    console.log(JSON.stringify(managers.data));
  });
});
