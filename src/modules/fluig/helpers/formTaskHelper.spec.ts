import { taskMock } from '@modules/fluig/mocks/task.mock';
import { anyObjToFormProperties } from '@modules/fluig/helpers/formTaskHelper';

describe('Unit test - formTaskHelper', () => {
  it('should be possible convert an array obj to FormProperties', () => {
    // private func
    // const formProperties = Object.getPrototypeOf(service).getFormProperties(
    //   taskMock[0],
    // );
    const formProperties = anyObjToFormProperties(taskMock[0]);

    expect(formProperties).toEqual([
      { name: 'realizadoId___1', value: '1' },
      { name: 'realizadoNumeroOMOP___1', value: '1000204' },
      { name: 'realizadoCodOMOP___1', value: '1000204' },
      { name: 'realizadoOperacaoTarefa___1', value: '20' },
      {
        name: 'realizadoOperacaoTarefaNome___1',
        value: 'HORAS TRABALHADAS',
      },
      { name: 'realizadoProjeto___1', value: 'BFF PRONTA FINA LL5874502' },
      {
        name: 'realizadoObservacao___1',
        value: 'Validation / Construction of FDS screens',
      },
      { name: 'realizadoData___1', value: '03/08/2022' },
      { name: 'realizadoInicio___1', value: '08:03' },
      { name: 'realizadoFim___1', value: '11:50' },
      { name: 'realizadoHoras___1', value: '03:47' },
      { name: 'txtAprovacao___1', value: '' },
      { name: 'aprovadoAprovacaoCheckbox___1', value: 'on' },
      { name: 'realizadoAprovado___1', value: 'false' },
    ]);
  });
});
