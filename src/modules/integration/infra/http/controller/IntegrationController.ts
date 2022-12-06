import { inject } from 'tsyringe';
import CreateTasksForWorkflowService from '@modules/fluig/services/CreateTasksForWorkflowService';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import { plainToInstance } from 'class-transformer';
import SheetTaskModel from '@modules/integration/infra/local/models/SheetTaskModel';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';
import SheetFluigUser from '@modules/integration/infra/local/models/SheetFluigUser';
import GetFluigUserService from '@modules/fluig/services/GetFluigUserService';
import GetUserConectionDetailsService from '@modules/integration/services/GetUserConectionDetailsService';

export default class IntegrationController {
  constructor(
    @inject(GetUserConectionDetailsService)
    private getUserConectionDetailsService: GetUserConectionDetailsService,
    @inject(GetFluigUserService)
    private getFluigUserService: GetFluigUserService,
    @inject(GetSpreadsheetService)
    private getSpreadsheetService: GetSpreadsheetService,
    @inject(CreateTasksForWorkflowService)
    private createTasksForWorkflowService: CreateTasksForWorkflowService,
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

    const user = await this.getFluigUserService.execute(userUUID);

    const sheetTasks = await this.getSpreadsheetService.execute(clientId, {
      spreadsheetId: '1uYLY1xtGQRqPeaUMzzmuVM5vb_fYP8qwDjiS1rb0EjE',
      range: 'Horas!A2:!H',
    });

    const sheetFluigUser = await this.getSpreadsheetService.execute(clientId, {
      spreadsheetId: '1uYLY1xtGQRqPeaUMzzmuVM5vb_fYP8qwDjiS1rb0EjE',
      range: 'Configurações!F2:!H3',
    });

    const tasks = plainToInstance(SheetTaskModel, sheetTasks);
    const fluigUser = plainToInstance(SheetFluigUser, sheetFluigUser);

    // TODO: Create service to parse SheetTaskModel to TaskDTO -- STOP HERE

    const tasksFormData = await this.createTasksForWorkflowService.execute(
      user,
      fluigUser.employeeReg,
      tasks,
      'TESTETESTE',
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

    // TODO: Need create service to send workflowTask
  }
}
