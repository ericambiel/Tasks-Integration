import { inject, singleton } from 'tsyringe';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';
import integration from '@config/integration';
import ConsoleLog from '@libs/ConsoleLog';
import IGetUserConectionDetailsService from '@modules/integration/services/IGetUserConectionDetailsService';
import IListUserConectionDetailsService from '@modules/integration/services/IListUserConectionDetailsService';
import IGetFluigUserService from '@modules/fluig/services/IGetFluigUserService';
import ICreateFluigTasksService from '@modules/fluig/services/ICreateFluigTasksService';
import ICreateFluigWorkflowService from '@modules/fluig/services/ICreateFluigWorkflowService';
import IGetWorkbookDetailsService from '@modules/googleSheets/services/IGetWorkbookDetailsService';
import GetUserConectionDetailsService from '@modules/integration/services/GetUserConectionDetailsService';
import ListUserConectionDetailsService from '@modules/integration/services/ListUserConectionDetailsService';
import GetFluigUserService from '@modules/fluig/services/GetFluigUserService';
import CreateFluigTasksService from '@modules/fluig/services/CreateFluigTasksService';
import CreateFluigWorkflowService from '@modules/fluig/services/CreateFluigWorkflowService';
import GetWorkbookDetailsService from '@modules/googleSheets/services/GetWorkbookDetailsService';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IIntegrationRepository';
import GetTaskFromGoogleSheetsService from '@modules/integration/services/GetTaskFromGoogleSheetsService';
import GetFluigLoginFromGoogleSheetsService from '@modules/integration/services/GetFluigLoginFromGoogleSheetsService';

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
    @inject(CreateFluigTasksService)
    private createFluigTasksService: ICreateFluigTasksService,
    @inject(CreateFluigWorkflowService)
    private createFluigWorkflowService: ICreateFluigWorkflowService,
    @inject(GetWorkbookDetailsService)
    private getWorksheetDetailsService: IGetWorkbookDetailsService,
    @inject(GetTaskFromGoogleSheetsService)
    private getTaskFromGoogleSheetsService: GetTaskFromGoogleSheetsService,
    @inject(GetFluigLoginFromGoogleSheetsService)
    private getFluigLoginFromGoogleSheetsService: GetFluigLoginFromGoogleSheetsService,
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
      googleUserSUB,
    } = userConnection;

    // TODO: Todo anything to keep this for next call of this class
    const [{ id: spreadsheetId }] =
      await this.getWorksheetDetailsService.execute(
        clientId,
        this.INTEGRATION_CONFIG.TASK_WORKBOOK,
      );

    if (!spreadsheetId)
      throw ConsoleLog.print(
        `Can't find spreadsheet from Google User: ${googleUserSUB}`,
        'error',
        'SERVER',
      );

    const fluigTasks = await this.getTaskFromGoogleSheetsService.execute({
      clientId,
      spreadsheetId,
    });

    const { employeeReg } =
      await this.getFluigLoginFromGoogleSheetsService.execute({
        clientId,
        spreadsheetId,
      });

    const fluigUser = await this.getFluigUserService.execute(userUUID);

    const tasksFormData = await this.createFluigTasksService.execute(
      fluigUser,
      employeeReg,
      fluigTasks,
      'Apontamento de horas em Projetos/Atendimentos',
    );

    // STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE STOP HERE
    // TODO: - Verify all properties given by Transformrs
    //       - Verify value to paramter for 'GET FROM JWT FLUIG TOKEN'
    const workflowTask: WorkflowTaskDTO[] =
      this.createFluigWorkflowService.execute(tasksFormData, fluigUser.sub);

    console.log(workflowTask);

    // TODO: Need create service to send workflowTask
  }

  async listAllConnections(): Promise<IntegrationConnType[]> {
    return this.listUserConectionDetailsService.execute();
  }
}
