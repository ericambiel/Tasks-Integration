import { TaskDTO } from '../dtos/TaskDTO';

const taskMock: TaskDTO[] = [
  {
    realizadoId: '1',
    realizadoNumeroOMOP: '1000204',
    realizadoCodOMOP: '1000204',
    realizadoOperacaoTarefa: '20',
    realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS',
    realizadoProjeto: 'BFF PRONTA FINA LL5874502',
    realizadoObservacao: 'Validação / Construção de telas do FDS',
    realizadoData: '03/08/2022',
    realizadoInicio: '08:03',
    realizadoFim: '11:50',
    realizadoHoras: '03:47',
    txtAprovacao: '',
    aprovadoAprovacaoCheckbox: 'on',
    realizadoAprovado: 'false',
  },
  {
    realizadoId: '2',
    realizadoNumeroOMOP: '1000204',
    realizadoCodOMOP: '1000204',
    realizadoOperacaoTarefa: '20',
    realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS',
    realizadoProjeto: 'BFF PRONTA FINA LL5874502',
    realizadoObservacao: 'Validação / Construção de telas do FDS',
    realizadoData: '03/08/2022',
    realizadoInicio: '12:38',
    realizadoFim: '17:47',
    realizadoHoras: '05:09',
    txtAprovacao: '',
    aprovadoAprovacaoCheckbox: 'on',
    realizadoAprovado: 'false',
  },
];

// eslint-disable-next-line import/prefer-default-export
export { taskMock };
