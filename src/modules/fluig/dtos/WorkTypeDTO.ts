import { ISheetOMOPModel } from '@modules/integration/infra/local/models/SheetOMOPModel';

export type WorkTypeDTO = {
  /** @example
   * ['nrOM_OP', '1000204', 'tpApontamento', 'OM']
   * ['nrOM_OP', '127335', 'tpApontamento', 'OP']
   */
  filterFields: [
    'nrOM_OP',
    string,
    'tpApontamento',
    ISheetOMOPModel['projectType'],
  ]; // "nrOM_OP" and "tpApontamento" could be any string
  /** @example
   * totvsBuscaTarefaOperacaoAptoDematic
   */
  datasetId: 'totvsBuscaTarefaOperacaoAptoDematic';
  searchField?: 'descricao' | string;
  resultFields?: ['codigoTarefaOperacao' | string, 'descricao' | string];
};
