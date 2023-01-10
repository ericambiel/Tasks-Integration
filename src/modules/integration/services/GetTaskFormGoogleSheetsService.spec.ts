import 'reflect-metadata';
import GetTaskFromGoogleSheetsService from '@modules/integration/services/GetTaskFromGoogleSheetsService';
import { container } from 'tsyringe';
import { worksheetArrayObjMock } from '@modules/googleSheets/infra/mocks/worksheetArrayObj.mock';
import { GoogleClientCredentialType } from '@shared/facades/GoogleAPIFacade';
import FluigTaskModel from '@modules/fluig/infra/local/models/FluigTaskModel';
import { taskTestSchema } from '@modules/fluig/mocks/task.mock';
import credentials from '../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';

describe('Unit test - GetTaskFromGoogleSheetService', () => {
  let service: GetTaskFromGoogleSheetsService;
  beforeAll(() => {
    container.register<GoogleClientCredentialType[]>(
      'GoogleClientCredentialType',
      {
        useValue: [credentials],
      },
    );
    service = container.resolve(GetTaskFromGoogleSheetsService);
  });

  it('Should be correct transform plain object', () => {
    // private func
    const formProperties: FluigTaskModel[] = Object.getPrototypeOf(
      service,
    ).transformer(worksheetArrayObjMock);

    console.log(formProperties);
    formProperties.forEach(formPropert =>
      expect(formPropert).toEqual(taskTestSchema),
    );
  });
});
