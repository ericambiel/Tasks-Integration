import { Expose } from 'class-transformer';
import { ISheet } from '@modules/googleSheets/services/GetSpreadsheetService';

export interface ISheetFluigUser {
  metadata: ISheet<never>['metadata'];
  username: string;
  password: string;
  employeeReg: string;
}

export default class SheetFluigUser implements ISheetFluigUser {
  @Expose({ name: 'metadata' })
  metadata: ISheet<never>['metadata'];

  @Expose({ name: 'Usuário Fluig' })
  username: string;

  @Expose({ name: 'Senha Fluig' })
  password: string;

  @Expose({ name: 'Matrícula' })
  employeeReg: string;
}
