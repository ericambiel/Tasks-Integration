import { arrayArrayToObjArrayHead } from '@shared/helpers/smallHelper';
import { worksheetArrayArrayMock } from '@modules/googleSheets/infra/mocks/worksheetArrayArray.mock';

describe('Unit test - smallHelper', () => {
  it('Should be transform ArrayArray to ArrayObj', () => {
    const arrayObjs = arrayArrayToObjArrayHead(worksheetArrayArrayMock);
    expect(arrayObjs).toEqual(expect.arrayContaining([expect.any(Object)]));

    // TODO: test if all Keys of Objets apear in ArrayArray HEAD [0]
  });
});
