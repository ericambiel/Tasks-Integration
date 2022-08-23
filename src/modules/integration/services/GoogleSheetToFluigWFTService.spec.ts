import 'reflect-metadata';

import { container } from 'tsyringe';
import GoogleSheetToFluigWFService from './GoogleSheetToFluigWFTService';
import { taskMock } from '../mocks/task.mock';
import { spreadsheetArrayObjMock } from '../../googleSheets/infra/mocks/spreadsheetArrayObj.mock';

describe('Unit test - ', () => {
  let service: GoogleSheetToFluigWFService;

  beforeAll(() => {
    service = container.resolve(GoogleSheetToFluigWFService);
  });

  it('should be possible convert an obj to FormProperties', () => {
    const formProperties = service.execute(spreadsheetArrayObjMock);
    console.log(formProperties);
  });

  it('should be possible convert an array obj to FormProperties', () => {
    const ret = service.execute(taskMock[0]);
    console.log(ret);
  });
});
