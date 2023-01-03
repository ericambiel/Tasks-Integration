import { inject, singleton } from 'tsyringe';
import { plainToInstance } from 'class-transformer';
import SheetTaskModel from '@modules/integration/infra/local/models/SheetTaskModel';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';
import SheetFluigUser from '@modules/integration/infra/local/models/SheetFluigUser';
import FluigTaskModel from '@modules/fluig/infra/local/models/FluigTaskModel';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IntegrationRepository';
import integration from '@config/integration';
import ConsoleLog from '@libs/ConsoleLog';
import IGetUserConectionDetailsService from '@modules/integration/services/IGetUserConectionDetailsService';
import IListUserConectionDetailsService from '@modules/integration/services/IListUserConectionDetailsService';
import IGetFluigUserService from '@modules/fluig/services/IGetFluigUserService';
import IGetWorksheetService from '@modules/googleSheets/services/IGetWorksheetService';
import ICreateFluigTasksService from '@modules/fluig/services/ICreateFluigTasksService';
import ICreateFluigWorkflowService from '@modules/fluig/services/ICreateFluigWorkflowService';
import IGetWorkbookDetailsService from '@modules/googleSheets/services/IGetWorkbookDetailsService';

@singleton()
export default class IntegrationController {
  private readonly INTEGRATION_CONFIG = integration();

  constructor(
    @inject('GetUserConectionDetailsService')
    private getUserConectionDetailsService: IGetUserConectionDetailsService,
    @inject('ListUserConectionDetailsService')
    private listUserConectionDetailsService: IListUserConectionDetailsService,
    @inject('GetFluigUserService')
    private getFluigUserService: IGetFluigUserService,
    @inject('GetWorksheetService')
    private getWorksheetService: IGetWorksheetService,
    @inject('CreateFluigTasksService')
    private createFluigTasksService: ICreateFluigTasksService,
    @inject('CreateFluigWorkflowService')
    private createFluigWorkflowService: ICreateFluigWorkflowService,
    @inject('GetWorkbookDetailsService')
    private getWorksheetDetailsService: IGetWorkbookDetailsService,
  ) {}

  async sendWorkflowFluig(userSUB: string): Promise<void> {
    const userConnection = this.getUserConectionDetailsService.execute({
      googleUserSUB: userSUB,
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
        `Can't find spreadsheet from Google User: ${userSUB}`,
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
