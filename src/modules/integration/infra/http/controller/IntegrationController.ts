import { inject, singleton } from 'tsyringe';
import CreateTasksForWorkflowService from '@modules/fluig/services/CreateTasksForWorkflowService';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
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
import GetSpreadsheetDetailsService from '@modules/googleSheets/services/GetSpreadsheetDetailsService';
import ConsoleLog from '@libs/ConsoleLog';

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
    @inject(GetSpreadsheetService)
    private getSpreadsheetService: GetSpreadsheetService,
    @inject(CreateTasksForWorkflowService)
    private createTasksForWorkflowService: CreateTasksForWorkflowService,
    @inject(GetSpreadsheetDetailsService)
    private getSpreadsheetDetailsService: GetSpreadsheetDetailsService,
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
      await this.getSpreadsheetDetailsService.execute(
        clientId,
        this.INTEGRATION_CONFIG.TASK_SPREADSHEET,
      );

    if (!spreadsheetId)
      throw ConsoleLog.print(
        `Can't find spreadsheet from Google User: ${userSUB}`,
        'error',
        'SERVER',
      );

    const user = await this.getFluigUserService.execute(userUUID);

    const sheetTasksPlain = await this.getSpreadsheetService.execute(clientId, {
      spreadsheetId,
      range: 'Horas!A2:H',
    });

    const sheetFluigUser = await this.getSpreadsheetService.execute(clientId, {
      spreadsheetId,
      range: 'Configurações!F2:H3',
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

    const tasksFormData = await this.createTasksForWorkflowService.execute(
      user,
      fluigUser.employeeReg,
      fluigTasks,
      'Apontamento de horas em Projetos/Atendimentos',
    );

    // TODO: Leave this to service Fluig
    const workflowTask: WorkflowTaskDTO[] = tasksFormData.map(taskFormData => {
      return {
        processInstanceId: 0,
        processId: '047',
        version: 5,
        taskUserId: 'taskUserIdtaskUserIdtaskUserIdtaskUserIdtaskUserId',
        completeTask: true,
        currentMovto: 0,
        managerMode: false,
        selectedDestinyAfterAutomatic: -1,
        conditionAfterAutomatic: -1,
        selectedColleague: [],
        comments: '',
        newObservations: [],
        appointments: [],
        attachments: [],
        digitalSignature: false,
        formData: taskFormData,
        isDigitalSigned: false,
        versionDoc: 0,
        selectedState: 12,
        internalFields: [],
        transferTaskAfterSelection: false,
        currentState: 1,
      };
    });

    console.log(workflowTask);

    // TODO: Need create service to send workflowTask
  }

  async listAllConnections(): Promise<IntegrationConnType[]> {
    return this.listUserConectionDetailsService.execute();
  }
}
