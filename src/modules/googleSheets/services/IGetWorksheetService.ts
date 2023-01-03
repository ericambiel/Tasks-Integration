import { GetWorkbookValuesOption } from '@shared/facades/GoogleAPIFacade';
import { JWTPayloadGoogleUserDTO } from '@modules/googleSheets/dtos/JWTPayloadGoogleUserDTO';

export interface ISheet<T> {
  metadata: GetWorkbookValuesOption & {
    userSub: JWTPayloadGoogleUserDTO['sub'];
  };
  sheetValues: T[];
}

export default interface IGetWorksheetService {
  execute<T>(
    clientId: string,
    options: GetWorkbookValuesOption,
  ): Promise<ISheet<T>>;
}
