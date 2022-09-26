import { Expose } from 'class-transformer';

export interface ISheetFluigUser {
  username: string;
  password: string;
  employeeReg: string;
}

export default class SheetFluigUser implements ISheetFluigUser {
  @Expose({ name: 'Usuário Fluig' })
  username: string;

  @Expose({ name: 'Senha Fluig' })
  password: string;

  @Expose({ name: 'Matrícula' })
  employeeReg: string;
}