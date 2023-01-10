import { arrayArrayToObjArrayHead } from '@shared/helpers/smallHelper';
import { worksheetArrayArrayMock } from '@modules/googleSheets/infra/mocks/worksheetArrayArray.mock';
import { worksheetTestSchema } from '@modules/googleSheets/infra/mocks/worksheetArrayObj.mock';

describe('Unit test - smallHelper', () => {
  it('Should be transform ArrayArray to ArrayObj', () => {
    const arrayObjs = arrayArrayToObjArrayHead(worksheetArrayArrayMock, {
      undefinedTo: '',
    });

    arrayObjs.forEach(obj => expect(obj).toEqual(worksheetTestSchema));
  });
});
