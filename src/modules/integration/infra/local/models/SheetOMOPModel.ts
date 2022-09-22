import { Expose } from 'class-transformer';

export interface ISheetOMOPModel {
  oMOPCod: string;
  projectType: 'OM' | 'OP';
  customerName: string;
}

export default class SheetOMOPModel implements ISheetOMOPModel {
  @Expose({ name: 'OM/OP' })
  oMOPCod: string;

  @Expose({ name: 'Tipo' })
  projectType: 'OM' | 'OP';

  @Expose({ name: 'Cliente' })
  customerName: string;
}
