import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';

const taskFormDataSchema: TaskFormDataDTO[] = [
  [
    {
      name: 'gerente',
      value: 'sevarolb',
    },
    {
      name: 'nomeGerente',
      value: '',
    },
    {
      name: 'dtAprovacao',
      value: '',
    },
    {
      name: 'horaAprovacao',
      value: '',
    },
    {
      name: 'apontamentosRealizadosJson',
      value:
        '[{"realizadoId":"1","realizadoNumeroOMOP":"1000204","realizadoCodOMOP":"1000204","realizadoOperacaoTarefa":"20","realizadoOperacaoTarefaNome":"HORAS TRABALHADAS","realizadoProjeto":"BFF PRONTA FINA LL5874502","realizadoObservacao":"Validation / Construction of FDS screens","realizadoData":"03/08/2022","realizadoInicio":"08:03","realizadoFim":"11:50","realizadoHoras":"03:47","txtAprovacao":"","aprovadoAprovacaoCheckbox":"on","realizadoAprovado":"false"},{"realizadoId":"2","realizadoNumeroOMOP":"1000204","realizadoCodOMOP":"1000204","realizadoOperacaoTarefa":"20","realizadoOperacaoTarefaNome":"HORAS TRABALHADAS","realizadoProjeto":"BFF PRONTA FINA LL5874502","realizadoObservacao":"Validation / Construction of FDS screens","realizadoData":"03/08/2022","realizadoInicio":"12:38","realizadoFim":"17:47","realizadoHoras":"05:09","txtAprovacao":"","aprovadoAprovacaoCheckbox":"on","realizadoAprovado":"false"}]',
    },
    {
      name: 'apontamentosAprovados',
      value: '',
    },
    {
      name: 'solicitacao',
      value: '',
    },
    {
      name: 'solicitante',
      value: 'Eric Ambiel',
    },
    {
      name: 'txtMatriculaSolicitante',
      value: '',
    },
    {
      name: 'txtEmailSolicitante',
      value: '',
    },
    {
      name: 'dataSolicitacao',
      value: expect.any(String),
    },
    {
      name: 'txtHoraSolicitacao',
      value: expect.any(String),
    },
    {
      name: 'tipoApontamento',
      value: 'OM',
    },
    {
      name: 'codTecnico',
      value: '102878',
    },
    {
      name: 'nomeTecnico',
      value: 'Eric Ambiel',
    },
    {
      name: 'atividades',
      value: 'Fulfillment of work order or project work.',
    },
    {
      name: 'observacoes',
      value: '',
    },
    {
      name: 'apontamentoNumeroOM_OP',
      value: '',
    },
    {
      name: 'apontamentoCodOM_OP',
      value: '',
    },
    {
      name: 'apontamentoProjeto',
      value: '',
    },
    {
      name: 'apontamentoOperacaoTarefa',
      value: '',
    },
    {
      name: 'apontamentoData',
      value: '',
    },
    {
      name: 'apontamentoInicio',
      value: '',
    },
    {
      name: 'apontamentoFim',
      value: '',
    },
    {
      name: 'apontamentoHoras',
      value: '',
    },
    {
      name: 'apontamentoObservacao',
      value: '',
    },
    {
      name: 'realizadoId',
      value: '',
    },
    {
      name: 'txtAprovacao',
      value: '',
    },
    {
      name: 'realizadoNumeroOMOP',
      value: '',
    },
    {
      name: 'realizadoCodOMOP',
      value: '',
    },
    {
      name: 'realizadoProjeto',
      value: '',
    },
    {
      name: 'realizadoOperacaoTarefa',
      value: '',
    },
    {
      name: 'realizadoOperacaoTarefaNome',
      value: '',
    },
    {
      name: 'realizadoData',
      value: '',
    },
    {
      name: 'realizadoInicio',
      value: '',
    },
    {
      name: 'realizadoFim',
      value: '',
    },
    {
      name: 'realizadoHoras',
      value: '',
    },
    {
      name: 'realizadoObservacao',
      value: '',
    },
    {
      name: 'realizadoAprovado',
      value: '',
    },
    {
      name: 'chkTipoApontamento',
      value: '',
    },
    {
      name: 'apontamentoOperacaoTarefaNome',
      value: '',
    },
    {
      name: 'aprovadoAprovacaoCheckbox',
      value: '',
    },
    {
      name: 'realizadoId___1',
      value: '1',
    },
    {
      name: 'realizadoNumeroOMOP___1',
      value: '1000204',
    },
    {
      name: 'realizadoCodOMOP___1',
      value: '1000204',
    },
    {
      name: 'realizadoOperacaoTarefa___1',
      value: '20',
    },
    {
      name: 'realizadoOperacaoTarefaNome___1',
      value: 'HORAS TRABALHADAS',
    },
    {
      name: 'realizadoProjeto___1',
      value: 'BFF PRONTA FINA LL5874502',
    },
    {
      name: 'realizadoObservacao___1',
      value: 'Validation / Construction of FDS screens',
    },
    {
      name: 'realizadoData___1',
      value: '03/08/2022',
    },
    {
      name: 'realizadoInicio___1',
      value: '08:03',
    },
    {
      name: 'realizadoFim___1',
      value: '11:50',
    },
    {
      name: 'realizadoHoras___1',
      value: '03:47',
    },
    {
      name: 'txtAprovacao___1',
      value: '',
    },
    {
      name: 'aprovadoAprovacaoCheckbox___1',
      value: 'on',
    },
    {
      name: 'realizadoAprovado___1',
      value: 'false',
    },
    {
      name: 'realizadoId___2',
      value: '2',
    },
    {
      name: 'realizadoNumeroOMOP___2',
      value: '1000204',
    },
    {
      name: 'realizadoCodOMOP___2',
      value: '1000204',
    },
    {
      name: 'realizadoOperacaoTarefa___2',
      value: '20',
    },
    {
      name: 'realizadoOperacaoTarefaNome___2',
      value: 'HORAS TRABALHADAS',
    },
    {
      name: 'realizadoProjeto___2',
      value: 'BFF PRONTA FINA LL5874502',
    },
    {
      name: 'realizadoObservacao___2',
      value: 'Validation / Construction of FDS screens',
    },
    {
      name: 'realizadoData___2',
      value: '03/08/2022',
    },
    {
      name: 'realizadoInicio___2',
      value: '12:38',
    },
    {
      name: 'realizadoFim___2',
      value: '17:47',
    },
    {
      name: 'realizadoHoras___2',
      value: '05:09',
    },
    {
      name: 'txtAprovacao___2',
      value: '',
    },
    {
      name: 'aprovadoAprovacaoCheckbox___2',
      value: 'on',
    },
    {
      name: 'realizadoAprovado___2',
      value: 'false',
    },
  ],
];

// eslint-disable-next-line import/prefer-default-export
export { taskFormDataSchema };
