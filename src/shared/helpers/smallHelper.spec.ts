import { arrayArrayToObjArrayHead } from '@shared/helpers/smallHelper';
import { spredshetArrayArrayMock } from '@modules/googleSheets/infra/mocks/spreadsheetArrayArray.mock';

describe('Unit test - smallHelper', () => {
  it('Should be transform ArrayArray to ArrayObj', () => {
    const arrayObjs = arrayArrayToObjArrayHead(spredshetArrayArrayMock);
    expect(arrayObjs).toEqual(expect.arrayContaining([expect.any(Object)]));

    // TODO: test all Keys of Objets apear in ArrayArray HEAD [0]
  });
});
