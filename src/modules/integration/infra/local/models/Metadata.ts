import { Expose } from 'class-transformer';
import { ISheet } from '@modules/googleSheets/services/GetWorksheetService';

export interface IMetadata {
  metadata: ISheet<never>['metadata'];
}

export default class Metadata implements IMetadata {
  @Expose({ name: 'metadata' })
  metadata: ISheet<never>['metadata'];
}
