import { Expose, Transform } from 'class-transformer';
import { stringToEnum } from '@shared/helpers/smallHelper';

// eslint-disable-next-line no-shadow
enum FluigStatusEnum {
  AP = 'pointTaskOnFluig',
  OK = 'pointedTaskOK',
  NOK = 'pointedTaskNotOK',
}

export interface ISpreedSheetTask {
  solicitationId: number;
  fluigStatus: string;
  oMOPCod: string;
  startDateTime: Date;
  endDateTime: Date;
  description: string;
}

export default class SpreadsheetTaskModel implements ISpreedSheetTask {
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
