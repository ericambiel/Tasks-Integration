import 'reflect-metadata';

import { container } from 'tsyringe';
import GetMinimumRequiredToWorkflowOMService from '@modules/fluig/services/GetMinimumRequiredToWorkflowOMService';
import { authorizeUserAxiosFluig } from '@shared/__test__/helper.test';
import { Axios } from 'axios';
import { taskMock } from '@modules/fluig/mocks/task.mock';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { NameFnEnum } from '@shared/helpers/FluigAPIHelper';

describe('Unit test - GetMinimumRequiredToWorkflow', () => {
  let service: GetMinimumRequiredToWorkflowOMService;
  let repository: FluigUserRepository;

  beforeAll(async () => {
    const axios = await authorizeUserAxiosFluig();
    container.registerInstance(Axios, axios);
    service = container.resolve(GetMinimumRequiredToWorkflowOMService);
    repository = container.resolve(FluigUserRepository);
  });

  it('Should be possible get Manager from OP or OM', async () => {
    const fluigUser = await repository.list()[0];
    const taskFormData = await service.execute(
      fluigUser,
      '102878',
      '1000204',
      taskMock,
      NameFnEnum.OM,
    );

    console.log(taskFormData);
  });

  it('should be possible convert an obj to FormProperties', () => {
    const formProperties =
      // private func
      Object.getPrototypeOf(service).getFormProperties(taskMock);

    console.log(formProperties);
  });

  it('should be possible convert an array obj to FormProperties', () => {
    // private func
    const formProperties = Object.getPrototypeOf(service).getFormProperties(
      taskMock[0],
    );

    console.log(formProperties);
  });
});
