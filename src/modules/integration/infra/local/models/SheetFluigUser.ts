import { Expose } from 'class-transformer';
import Metadata, {
  IMetadata,
} from '@modules/integration/infra/local/models/Metadata';

export interface ISheetFluigUser extends IMetadata {
  username: string;
  password: string;
  employeeReg: string;
}

export default class SheetFluigUser
  extends Metadata
  implements ISheetFluigUser
{
  @Expose({ name: 'Usuário Fluig' })
  username: string;

  @Expose({ name: 'Senha Fluig' })
  password: string;

  @Expose({ name: 'Matrícula' })
  employeeReg: string;
}
