import 'reflect-metadata';

import { container } from 'tsyringe';
import CreateTasksForWorkflowService from '@modules/fluig/services/CreateTasksForWorkflowService';
import { authorizeUserAxiosFluigTester } from '@shared/__test__/helper.test';
import { Axios } from 'axios';
import { taskMock } from '@modules/fluig/mocks/task.mock';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import { taskFormDataSchema } from '@modules/fluig/mocks/taskFormData.mock';

describe('Unit test - CreateTasksForWorkflowService', () => {
  let service: CreateTasksForWorkflowService;
  let repository: FluigUserRepository;

  beforeAll(async () => {
    const axios = await authorizeUserAxiosFluigTester();
    container.registerInstance(Axios, axios);
    service = container.resolve(CreateTasksForWorkflowService);
    repository = container.resolve(FluigUserRepository);
  });

  it('Should be possible make a TaskFormData Array', async () => {
    const fluigUser = await repository.list()[0];
    const taskFormData = await service.execute(
      fluigUser,
      '102878',
      taskMock,
      'Fulfillment of work order or project work.',
    );

    expect(taskFormData).toEqual(taskFormDataSchema);
  });
});
