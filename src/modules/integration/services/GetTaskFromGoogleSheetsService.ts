import { inject, singleton } from 'tsyringe';
import GetWorksheetService from '@modules/googleSheets/services/GetWorksheetService';
import { plainToInstance } from 'class-transformer';
import SheetTaskModel from '@modules/integration/infra/local/models/SheetTaskModel';
import FluigTaskModel from '@modules/fluig/infra/local/models/FluigTaskModel';
import integration from '@config/integration';

@singleton()
export default class GetTaskFromGoogleSheetsService {
  private readonly INTEGRATION_CONFIG = integration();

  constructor(
    @inject(GetWorksheetService)
    private getWorksheetService: GetWorksheetService,
  ) {}

  async execute(options: {
    clientId: string;
    spreadsheetId: string;
  }): Promise<FluigTaskModel[]> {
    const sheetTasksPlain = await this.getWorksheetService.execute(
      options.clientId,
      {
        spreadsheetId: options.spreadsheetId,
        range: this.INTEGRATION_CONFIG.TASK_RANGE_WORKSHEET,
      },
    );

    // TODO: Remove all tasks from "sheetTasksPlain" that not flaged to OK

    return this.transformer(sheetTasksPlain.sheetValues);
  }

  private transformer(sheetValues: any[]): FluigTaskModel[] {
    const sheetTasks = plainToInstance(SheetTaskModel, sheetValues);

    const fluigTasks = plainToInstance(FluigTaskModel, sheetTasks);

    let counter = 0; // contador
    const result: FluigTaskModel[] = [];
    fluigTasks.forEach(obj => {
      counter += 1;
      result.push({ ...obj, realizadoId: counter.toString() });
    });

    return result;
  }
}
