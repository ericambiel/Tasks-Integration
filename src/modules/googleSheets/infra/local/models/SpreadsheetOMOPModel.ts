import { Expose } from 'class-transformer';

export interface ISpreadsheetOMOPModel {
  oMOPCod: string;
  projectType: 'OM' | 'OP';
  customerName: string;
}

export default class SpreadsheetOMOPModel implements ISpreadsheetOMOPModel {
  @Expose({ name: 'OM/OP' })
  oMOPCod: string;

  @Expose({ name: 'Tipo' })
  projectType: 'OM' | 'OP';

  @Expose({ name: 'Tipo' })
  customerName: string;
}
