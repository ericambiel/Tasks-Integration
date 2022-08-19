import { stringifyToSlashedJSON } from '@shared/helpers/smallHelper';

describe('Unit Test - smallHelper', () => {
  const obj = [
    {
      realizadoId: '1',
      txtAprovacao: '',
      aprovadoAprovacaoCheckbox: 'on',
      realizadoNumeroOMOP: '1000204',
      realizadoCodOMOP: '1000204',
      realizadoProjeto: 'BFF PRONTA GROSSA LL45456411',
      realizadoOperacaoTarefa: '20',
      realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS',
      realizadoData: '02/08/2022',
      realizadoInicio: '08:05',
      realizadoFim: '12:00',
      realizadoHoras: '03:55',
      realizadoObservacao: 'Validação / Construção de telas do FDS',
      realizadoAprovado: 'false',
    },
    {
      realizadoId: '2',
      txtAprovacao: '',
      aprovadoAprovacaoCheckbox: 'on',
      realizadoNumeroOMOP: '1000204',
      realizadoCodOMOP: '1000204',
      realizadoProjeto: 'BRF PRONTA GROSSA MU1807041',
      realizadoOperacaoTarefa: '20',
      realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS',
      realizadoData: '02/08/2022',
      realizadoInicio: '12:48',
      realizadoFim: '17:46',
      realizadoHoras: '04:58',
      realizadoObservacao: 'Validação / Construção de telas do FDS',
      realizadoAprovado: 'false',
    },
  ];

  it('Should be possible stringify an object to specif string', () => {
    console.log(stringifyToSlashedJSON(obj));
  });
});
