import { ISpreadsheetOMOPModel } from '@modules/integration/infra/local/models/SpreadsheetOMOPModel';

export type WorkTypeDTO = {
  /** @example
   * ['nrOM_OP', '1000204', 'tpApontamento', 'OM']
   * ['nrOM_OP', '127335', 'tpApontamento', 'OP']
   */
  filterFields: [
    'nrOM_OP',
    string,
    'tpApontamento',
    ISpreadsheetOMOPModel['projectType'],
  ]; // "nrOM_OP" and "tpApontamento" could be any string
  /** @example
   * totvsBuscaTarefaOperacaoAptoDematic
   */
  datasetId: 'totvsBuscaTarefaOperacaoAptoDematic';
  searchField?: 'descricao' | string;
  resultFields?: ['codigoTarefaOperacao' | string, 'descricao' | string];
};
