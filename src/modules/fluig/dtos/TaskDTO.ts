export type TaskDTO = {
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
  // TODO: make enum type to match "realizadoProjeto" to "realizadoOperacaoTarefaNome"
  /**
   * Project description referring to OP/OM. Get from 'Dataset' - 'Find OM by ID'.
   * @example
   * 'BFF PRONTA FINA LL5874502'
   */
  realizadoProjeto: string;
  /**
   * Cod type of operation realized - Get from 'Workflow - Get Type of Work'
   * @default "20" | "300"
   * @example
   *            OM
   * DESLOCAMENTO DE IDA                — '10'
   * HORAS TRABALHADAS                  — '20' @default
   * DESLOCAMENTO DE VOLTA              — '30'
   *            OP
   * GGF TERCEIROS                      — '40'
   * HORAS ENGENHARIA MECANICA          — '100'
   * ENGENHARIA MECANICA - 22000        — '101'
   * HORAS ENGENHARIA ELETRICA          — '200'
   * ENGENHARIA ELETRICA - 23000        — '201'
   * ENGENHARIA ELETRICA - CATB - 23003 — '203'
   * HORAS ENGENHARIA IT                — '300' @default
   * GERENCIAMENTO DE IT - CATB 25002   — '301'
   * HORAS GERENCIA DE PROJETOS         — '400'
   * HORAS - INSTALAÇÃO                 — '500'
   * INSTALACAO CAT B - 31003           — '501'
   * HORAS - SERVICE - 30006            — '540'
   * Tecnicos - 30012                   — '541'
   * HORAS - SERVICE 30005              — '550'
   * Tecnicos - 30013                   — '552'
   * Tecnicos - 300016                  — '553'
   * Tecnicos 31003                     — '554'
   * ENGENHARIA R&D - 99994             — '555'
   * Tecnicos 31004                     — '556'
   */
  realizadoOperacaoTarefa: '20' | '300' | string;
  /**
   * Cod type of operation realized - Get from 'Workflow - Get Type of Work'
   * @example
   * 'HORAS TRABALHADAS'    - 20
   * 'HORAS ENGENHARIA IT'  - 300
   */
  realizadoOperacaoTarefaNome:
    | 'HORAS TRABALHADAS'
    | 'HORAS ENGENHARIA IT'
    | string;
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
   * Local time you end the task.
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
