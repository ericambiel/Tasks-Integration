import { Expose } from 'class-transformer';
import Metadata, {
  IMetadata,
} from '@modules/integration/infra/local/models/Metadata';

export interface ISheetOMOPModel extends IMetadata {
  oMOPCod: string;
  projectType: 'OM' | 'OP';
  customerName: string;
}

export default class SheetOMOPModel
  extends Metadata
  implements ISheetOMOPModel
{
  @Expose({ name: 'OM/OP' })
  oMOPCod: string;

  @Expose({ name: 'Tipo' })
  projectType: 'OM' | 'OP';

  @Expose({ name: 'Cliente' })
  customerName: string;
}
