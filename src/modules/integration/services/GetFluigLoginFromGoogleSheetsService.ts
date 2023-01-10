import { inject, singleton } from 'tsyringe';
import GetWorksheetService from '@modules/googleSheets/services/GetWorksheetService';
import { plainToInstance } from 'class-transformer';
import integration from '@config/integration';
import SheetFluigUser from '@modules/integration/infra/local/models/SheetFluigUser';

@singleton()
export default class GetFluigLoginFromGoogleSheetsService {
  private readonly INTEGRATION_CONFIG = integration();

  constructor(
    @inject(GetWorksheetService)
    private getWorksheetService: GetWorksheetService,
  ) {}

  async execute(options: {
    clientId: string;
    spreadsheetId: string;
  }): Promise<SheetFluigUser> {
    const sheetFluigLoginPlain = await this.getWorksheetService.execute(
      options.clientId,
      {
        spreadsheetId: options.spreadsheetId,
        range: this.INTEGRATION_CONFIG.CONF_RANGE_WORKSHEET,
      },
    );

    return plainToInstance(SheetFluigUser, sheetFluigLoginPlain.sheetValues[0]);
  }
}
