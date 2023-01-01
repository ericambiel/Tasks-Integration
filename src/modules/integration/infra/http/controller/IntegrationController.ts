import { inject, singleton } from 'tsyringe';
import CreateFluigTasksService from '@modules/fluig/services/CreateFluigTasksService';
import GetWorksheetService from '@modules/googleSheets/services/GetWorksheetService';
import { plainToInstance } from 'class-transformer';
import SheetTaskModel from '@modules/integration/infra/local/models/SheetTaskModel';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';
import SheetFluigUser from '@modules/integration/infra/local/models/SheetFluigUser';
import GetFluigUserService from '@modules/fluig/services/GetFluigUserService';
import GetUserConectionDetailsService from '@modules/integration/services/GetUserConectionDetailsService';
import FluigTaskModel from '@modules/fluig/infra/local/models/FluigTaskModel';
import ListUserConectionDetailsService from '@modules/integration/services/ListUserConectionDetailsService';
import { IntegrationConnType } from '@modules/integration/infra/local/repositories/IntegrationRepository';
import integration from '@config/integration';
import GetWorksheetDetailsService from '@modules/googleSheets/services/GetWorksheetDetailsService';
import ConsoleLog from '@libs/ConsoleLog';
import CreateFluigWorkflowService from '@modules/fluig/services/CreateFluigWorkflowService';

@singleton()
export default class IntegrationController {
  private readonly INTEGRATION_CONFIG = integration();

  constructor(
    @inject(GetUserConectionDetailsService)
    private getUserConectionDetailsService: GetUserConectionDetailsService,
    @inject(ListUserConectionDetailsService)
    private listUserConectionDetailsService: ListUserConectionDetailsService,
    @inject(GetFluigUserService)
    private getFluigUserService: GetFluigUserService,
    @inject(GetWorksheetService)
    private getWorksheetService: GetWorksheetService,
    @inject(CreateFluigTasksService)
    private createFluigTasksService: CreateFluigTasksService,
    @inject(CreateFluigWorkflowService)
    private createFluigWorkflowService: CreateFluigWorkflowService,
    @inject(GetWorksheetDetailsService)
    private getWorksheetDetailsService: GetWorksheetDetailsService,
  ) {}

  async sendWorkflowFluig(userSUB: string): Promise<void> {
    const userConnection = this.getUserConectionDetailsService.execute({
      googleUserSUB: userSUB,
    });

    if (!userConnection) throw Error("Can't find active connections");
    if (!userConnection.googleClientId)
      throw Error("Can't find clientId to users");

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

    // STOP HERE
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
