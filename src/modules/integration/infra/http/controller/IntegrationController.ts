import { inject, singleton } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import SheetTaskModel from '@modules/integration/infra/local/models/SheetTaskModel';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';
import SheetFluigUser from '@modules/integration/infra/local/models/SheetFluigUser';
import FluigTaskModel from '@modules/fluig/infra/local/models/FluigTaskModel';
import integration from '@config/integration';
import ConsoleLog from '@libs/ConsoleLog';
import IGetUserConectionDetailsService from '@modules/integration/services/IGetUserConectionDetailsService';
import IListUserConectionDetailsService from '@modules/integration/services/IListUserConectionDetailsService';
import IGetFluigUserService from '@modules/fluig/services/IGetFluigUserService';
import IGetWorksheetService from '@modules/googleSheets/services/IGetWorksheetService';
import ICreateFluigTasksService from '@modules/fluig/services/ICreateFluigTasksService';
import ICreateFluigWorkflowService from '@modules/fluig/services/ICreateFluigWorkflowService';
import IGetWorkbookDetailsService from '@modules/googleSheets/services/IGetWorkbookDetailsService';
import GetUserConectionDetailsService from '@modules/integration/services/GetUserConectionDetailsService';
import ListUserConectionDetailsService from '@modules/integration/services/ListUserConectionDetailsService';
import GetFluigUserService from '@modules/fluig/services/GetFluigUserService';
import GetWorksheetService from '@modules/googleSheets/services/GetWorksheetService';
import CreateFluigTasksService from '@modules/fluig/services/CreateFluigTasksService';
import CreateFluigWorkflowService from '@modules/fluig/services/CreateFluigWorkflowService';
import GetWorkbookDetailsService from '@modules/googleSheets/services/GetWorkbookDetailsService';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IIntegrationRepository';

@singleton()
export default class IntegrationController {
  private readonly INTEGRATION_CONFIG = integration();

  constructor(
    @inject(GetUserConectionDetailsService)
    private getUserConectionDetailsService: IGetUserConectionDetailsService,
    @inject(ListUserConectionDetailsService)
    private listUserConectionDetailsService: IListUserConectionDetailsService,
    @inject(GetFluigUserService)
    private getFluigUserService: IGetFluigUserService,
    @inject(GetWorksheetService)
    private getWorksheetService: IGetWorksheetService,
    @inject(CreateFluigTasksService)
    private createFluigTasksService: ICreateFluigTasksService,
    @inject(CreateFluigWorkflowService)
    private createFluigWorkflowService: ICreateFluigWorkflowService,
    @inject(GetWorkbookDetailsService)
    private getWorksheetDetailsService: IGetWorkbookDetailsService,
  ) {}

  async sendWorkflowFluig(fluigUserUUID: string): Promise<void> {
    const userConnection = this.getUserConectionDetailsService.execute({
      fluigUserUUID,
    });

    if (!userConnection) throw Error("Can't find active connections");
    if (!userConnection.googleClientId)
      throw Error("Can't find clientId to user");

    const {
      googleClientId: [clientId],
      fluigUserUUID: userUUID,
    } = userConnection;

    const [{ id: spreadsheetId }] =
      await this.getWorksheetDetailsService.execute(
        clientId,
        this.INTEGRATION_CONFIG.TASK_WORKBOOK,
      );

    if (!spreadsheetId)
      throw ConsoleLog.print(
        `Can't find spreadsheet from Google User: ${userConnection.googleUserSUB}`,
        'error',
        'SERVER',
      );

    const user = await this.getFluigUserService.execute(userUUID);

    const sheetTasksPlain = await this.getWorksheetService.execute(clientId, {
      spreadsheetId,
      range: this.INTEGRATION_CONFIG.TASK_RANGE_WORKSHEET,
    });

    const sheetFluigUser = await this.getWorksheetService.execute(clientId, {
      spreadsheetId,
      range: this.INTEGRATION_CONFIG.CONF_RANGE_WORKSHEET,
    });

    const sheetTasks = plainToInstance(
      SheetTaskModel,
      sheetTasksPlain.sheetValues,
    );
    const fluigTasks = plainToInstance(FluigTaskModel, sheetTasks);
    const fluigUser = plainToInstance(
      SheetFluigUser,
      sheetFluigUser.sheetValues[0],
    );

    const tasksFormData = await this.createFluigTasksService.execute(
      user,
      fluigUser.employeeReg,
      fluigTasks,
      'Apontamento de horas em Projetos/Atendimentos',
    );

    // STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE
    // TODO: - Verify all properties given by Transformrs
    //       - Make tests for this class
    //       - Verify value to paramter for 'GET FROM JWT FLUIG TOKEN'
    const workflowTask: WorkflowTaskDTO[] =
      this.createFluigWorkflowService.execute(
        tasksFormData,
        'GET FROM JWT FLUIG TOKEN',
      );

    console.log(workflowTask);

    // TODO: Need create service to send workflowTask
  }

  async listAllConnections(): Promise<IntegrationConnType[]> {
    return this.listUserConectionDetailsService.execute();
  }
}
