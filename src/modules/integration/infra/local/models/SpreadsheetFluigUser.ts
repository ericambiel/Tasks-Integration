import { Expose } from 'class-transformer';

export interface ISpreadsheetFluigUser {
  username: string;
  password: string;
  employeeReg: string;
}

export default class SpreadsheetFluigUser implements ISpreadsheetFluigUser {
  @Expose({ name: 'Usuário Fluig' })
  username: string;

  @Expose({ name: 'Senha Fluig' })
  password: string;

  @Expose({ name: 'Matrícula' })
  employeeReg: string;
}
