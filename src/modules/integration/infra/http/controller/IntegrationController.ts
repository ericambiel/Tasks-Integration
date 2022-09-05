import { inject } from 'tsyringe';
import GetMinimumRequiredToWorkflowOMService from '@modules/fluig/services/GetMinimumRequiredToWorkflowOMService';
import AuthorizeFluigUserService from '@modules/fluig/services/AuthorizeFluigUserService';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import AuthorizeGoogleClientServer from '@modules/googleSheets/services/AuthorizeGoogleClientServer';
import { plainToInstance } from 'class-transformer';
import SpreadsheetOMOPModel from '@modules/integration/infra/local/models/SpreadsheetOMOPModel';
import SpreadsheetTaskModel from '@modules/integration/infra/local/models/SpreadsheetTaskModel';

export default class IntegrationController {
  constructor(
    @inject(GetSpreadsheetService)
    private getSpreadsheetService: GetSpreadsheetService,
    @inject(AuthorizeGoogleClientServer)
    private authorizeGoogleClientServer: AuthorizeGoogleClientServer,
    @inject(AuthorizeFluigUserService)
    private authorizeUserFluigService: AuthorizeFluigUserService,
    @inject(GetMinimumRequiredToWorkflowOMService)
    private getMinimumRequiredToWorkflowOMService: GetMinimumRequiredToWorkflowOMService,
  ) {}

  async createWorkflowFluig(): Promise<void> {
    await this.authorizeGoogleClientServer.execute({
      clientId: 'aasdasdasdasd',
      userToken: { refresh_token: 'asdasdasdasd' },
    });

    await this.authorizeUserFluigService.execute('asas', 'asasas');

    const spreadsheetTasks = await this.getSpreadsheetService.execute({
      spreadsheetId: '123123',
      range: 'Class Data!A2:E',
    });

    const spreadsheetOMOPs = await this.getSpreadsheetService.execute({
      spreadsheetId: '123123',
      range: 'Class Data!A2:E',
    });

    const tasks = plainToInstance(SpreadsheetTaskModel, spreadsheetTasks);
    const oMOPs = plainToInstance(SpreadsheetOMOPModel, spreadsheetOMOPs);
  }
}
