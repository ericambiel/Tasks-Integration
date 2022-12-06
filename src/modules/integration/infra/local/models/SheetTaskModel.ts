import { Expose, Transform } from 'class-transformer';
import { stringToEnum } from '@shared/helpers/smallHelper';
import Metadata, {
  IMetadata,
} from '@modules/integration/infra/local/models/Metadata';

// eslint-disable-next-line no-shadow
enum FluigStatusEnum {
  AP = 'pointTaskOnFluig',
  OK = 'pointedTaskOK',
  NOK = 'pointedTaskNotOK',
}

export interface ISheetTask extends IMetadata {
  solicitationId: number;
  fluigStatus: string;
  oMOPCod: string;
  startDateTime: Date;
  endDateTime: Date;
  description: string;
}

export default class SheetTaskModel extends Metadata implements ISheetTask {
  @Expose({ name: 'Solicitação' })
  solicitationId: number;

  @Expose({ name: 'Fluig' })
  @Transform(({ value }) => {
    return stringToEnum(FluigStatusEnum, value);
  })
  fluigStatus: string;

  @Expose({ name: 'OM/OP' })
  oMOPCod: string;

  @Expose({ name: 'Início' })
  startDateTime: Date;

  @Expose({ name: 'Fim' })
  endDateTime: Date;

  @Expose({ name: 'Descrição' })
  description: string;
}
