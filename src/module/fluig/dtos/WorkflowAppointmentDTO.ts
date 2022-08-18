export type AppointmentJSON = {
  /**
   * Sequential number(string format) starting at 1
   * @example
   * '1'
   */
  realizadoId: string;
  txtAprovacao: '';
  aprovadoAprovacaoCheckbox: 'on';
  /**
   * OM/OP Number.
   * @example
   * '1000204'
   */
  realizadoNumeroOMOP: string;
  /**
   * OM/OP Cod.
   * @example
   * '1000204'
   */
  realizadoCodOMOP: string;
  /**
   * Project description referring to OP/OM. Get from 'Dataset' - 'Find OM by ID'
   * @example
   * BFF PRONTA GROSSA LL5874502
   */
  realizadoProjeto: string;
  /**
   * Cod type of operation realized - Get from 'Workflow - Get Type of Work'
   * @example
   *            OM
   * DESLOCAMENTO DE IDA                - '10'
   * HORAS TRABALHADAS                  - '20' @default
   * DESLOCAMENTO DE VOLTA              - '30'
   *            OP
   * GGF TERCEIROS                      - '40'
   * HORAS ENGENHARIA MECANICA          - '100'
   * ENGENHARIA MECANICA - 22000        - '101'
   * HORAS ENGENHARIA ELETRICA          - '200'
   * ENGENHARIA ELETRICA - 23000        - '201'
   * ENGENHARIA ELETRICA - CATB - 23003 - '203'
   * HORAS ENGENHARIA IT                - '300' @default
   * GERENCIAMENTO DE IT - CATB 25002   - '301'
   * HORAS GERENCIA DE PROJETOS         - '400'
   * HORAS - INSTALAÇÃO                 - '500'
   * INSTALACAO CAT B - 31003           - '501'
   * HORAS - SERVICE - 30006            - '540'
   * Tecnicos - 30012                   - '541'
   * HORAS - SERVICE 30005              - '550'
   * Tecnicos - 30013                   - '552'
   * Tecnicos - 300016                  - '553'
   * Tecnicos 31003                     - '554'
   * ENGENHARIA R&D - 99994             - '555'
   * Tecnicos 31004                     - '556'
   */
  realizadoOperacaoTarefa: '20' | string;
  /**
   * Cod type of operation realized - Get from 'Workflow - Get Type of Work'
   * @example
   * 'HORAS TRABALHADAS' - 20
   */
  realizadoOperacaoTarefaNome: 'HORAS TRABALHADAS' | string;
  /**
   * Date you performed the task.
   * @example
   * '02/08/2022'
   */
  realizadoData: string;
  /**
   * Local time you start the task.
   * @Example
   * '08:05'
   */
  realizadoInicio: string;
  /**
   * Local time you start the task.
   * @Example
   * '12:00'
   */
  realizadoFim: string;
  /**
   * Total task execution time.
   * @example
   * '03:55'
   */
  realizadoHoras: string;
  /**
   * Brief description of the task performed in the informed period.
   * @example
   * 'Validation / Construction of SDS screens'
   */
  realizadoObservacao: string;
  realizadoAprovado: 'false';
};

export type WorkflowAppointmentDTO = {
  processInstanceId: 0;
  /**
   * Process ID
   * @example
   * Working hours recording (Apontamento Horas Trabalho) - '047'
   * Travel Request (Requisição de Viagem)                - '058'
   */
  processId: '047' | '058'; // Appointment Process ID is 047
  version: 5;
  /**
   * User Id - get from JWT TOKEN
   * @example
   * 'ambiele'
   */
  taskUserId: string;
  completeTask: true;
  currentMovto: 0;
  managerMode: false;
  selectedDestinyAfterAutomatic: -1;
  conditionAfterAutomatic: -1;
  selectedColleague: [];
  comments: '';
  newObservations: [];
  appointments: [];
  attachments: [];
  digitalSignature: false;
  formData: [
    {
      name: 'gerente';
      /**
       * Manager OP/OM user, get from Dataset (Find OM/OP by ID)
       * @example
       * 'sevarolb'
       */
      value: string;
    },
    {
      name: 'nomeGerente';
      value: '';
    },
    {
      name: 'dtAprovacao';
      value: '';
    },
    {
      name: 'horaAprovacao';
      value: '';
    },
    {
      name: 'apontamentosRealizadosJson';
      /**
       * All appointments value here in JSON format string (stringify)
       */
      value: AppointmentJSON[];
    },
    {
      name: 'apontamentosAprovados';
      value: '';
    },
    {
      name: 'solicitacao';
      value: '';
    },
    {
      name: 'solicitante';
      /**
       * Get from User is connected - Get Colleague by username, use JWT to given username
       * @example
       * 'Eric Ambiel'
       */
      value: string;
    },
    {
      name: 'txtMatriculaSolicitante';
      value: '';
    },
    {
      name: 'txtEmailSolicitante';
      value: '';
    },
    {
      name: 'dataSolicitacao';
      /**
       * Solicitation date
       * @example
       * '17/08/2022'
       */
      value: string;
    },
    {
      name: 'txtHoraSolicitacao';
      /**
       * Local your solicitation time
       * @example
       * '17:09:11'
       */
      value: string;
    },
    {
      name: 'tipoApontamento';
      /* Type of project appointment in */
      value: 'OM' | 'OP';
    },
    {
      name: 'codTecnico';
      /**
       * Worker registration (Matricula) - Given by USER
       * @example
       * '102878'
       */
      value: string;
    },
    {
      name: 'nomeTecnico';
      /**
       * Get from "Find Technician by Matricula (codTec)"
       * @example
       * 'Eric Ambiel' */
      value: string;
    },
    {
      name: 'atividades';
      /** @example
       * 'Work on the XPTO project' */
      value: string;
    },
    {
      name: 'observacoes';
      value: '';
    },
    {
      name: 'apontamentoNumeroOM_OP';
      value: '';
    },
    {
      name: 'apontamentoCodOM_OP';
      value: '';
    },
    {
      name: 'apontamentoProjeto';
      value: '';
    },
    {
      name: 'apontamentoOperacaoTarefa';
      value: '';
    },
    {
      name: 'apontamentoData';
      value: '';
    },
    {
      name: 'apontamentoInicio';
      value: '';
    },
    {
      name: 'apontamentoFim';
      value: '';
    },
    {
      name: 'apontamentoHoras';
      value: '';
    },
    {
      name: 'apontamentoObservacao';
      value: '';
    },
    {
      name: 'realizadoId';
      value: '';
    },
    {
      name: 'txtAprovacao';
      value: '';
    },
    {
      name: 'realizadoNumeroOMOP';
      value: '';
    },
    {
      name: 'realizadoCodOMOP';
      value: '';
    },
    {
      name: 'realizadoProjeto';
      value: '';
    },
    {
      name: 'realizadoOperacaoTarefa';
      value: '';
    },
    {
      name: 'realizadoOperacaoTarefaNome';
      value: '';
    },
    {
      name: 'realizadoData';
      value: '';
    },
    {
      name: 'realizadoInicio';
      value: '';
    },
    {
      name: 'realizadoFim';
      value: '';
    },
    {
      name: 'realizadoHoras';
      value: '';
    },
    {
      name: 'realizadoObservacao';
      value: '';
    },
    {
      name: 'realizadoAprovado';
      value: '';
    },
    {
      name: 'chkTipoApontamento';
      value: '';
    },
    {
      name: 'apontamentoOperacaoTarefaNome';
      value: '';
    },
    {
      name: 'aprovadoAprovacaoCheckbox';
      value: '';
    },
    //
    // Here need get all properties from "AppointmentJSON" array
    // and add "___realizadoId" in each key object name
    //
    {
      name: 'realizadoId___1';
      value: '1';
    },
    {
      name: 'txtAprovacao___1';
      value: '';
    },
    {
      name: 'realizadoNumeroOMOP___1';
      value: '1000204';
    },
    {
      name: 'realizadoCodOMOP___1';
      value: '1000204';
    },
    {
      name: 'realizadoProjeto___1';
      value: 'BRF PRONTA GROSSA MU1807041';
    },
    {
      name: 'realizadoOperacaoTarefa___1';
      value: '20';
    },
    {
      name: 'realizadoOperacaoTarefaNome___1';
      value: 'HORAS TRABALHADAS';
    },
    {
      name: 'realizadoData___1';
      value: '02/08/2022';
    },
    {
      name: 'realizadoInicio___1';
      value: '08:05';
    },
    {
      name: 'realizadoFim___1';
      value: '12:00';
    },
    {
      name: 'realizadoHoras___1';
      value: '03:55';
    },
    {
      name: 'realizadoObservacao___1';
      value: 'Validação / Construção de telas do FDS';
    },
    {
      name: 'realizadoAprovado___1';
      value: 'false';
    },
    {
      name: 'aprovadoAprovacaoCheckbox___1';
      value: '';
    },
  ];
  isDigitalSigned: false;
  versionDoc: 0;
  selectedState: 12;
  internalFields: [];
  transferTaskAfterSelection: false;
  currentState: 1;
};
