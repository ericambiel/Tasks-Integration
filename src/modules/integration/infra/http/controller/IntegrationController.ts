import { inject } from 'tsyringe';
import CreateTasksForWorkflowService from '@modules/fluig/services/CreateTasksForWorkflowService';
import AuthorizeFluigUserService from '@modules/fluig/services/AuthorizeFluigUserService';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import AuthorizeGoogleClientServer from '@modules/googleSheets/services/AuthorizeGoogleClientServer';
import { plainToInstance } from 'class-transformer';
import SpreadsheetTaskModel from '@modules/integration/infra/local/models/SpreadsheetTaskModel';
import { authorizeUserAxiosFluigTester } from '@shared/__test__/helper.test';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';

export default class IntegrationController {
  constructor(
    @inject(GetSpreadsheetService)
    private getSpreadsheetService: GetSpreadsheetService,
    @inject(AuthorizeGoogleClientServer)
    private authorizeGoogleClientServer: AuthorizeGoogleClientServer,
    @inject(AuthorizeFluigUserService)
    private authorizeUserFluigService: AuthorizeFluigUserService,
    @inject(CreateTasksForWorkflowService)
    private createTasksForWorkflowService: CreateTasksForWorkflowService,
  ) {}

  async createWorkflowFluig(): Promise<void> {
    await this.authorizeGoogleClientServer.execute({
      clientId: 'aasdasdasdasd',
      userToken: { refresh_token: 'asdasdasdasd' },
    });

    // await this.authorizeUserFluigService.execute('asas', 'asasas');
    await authorizeUserAxiosFluigTester();

    const spreadsheetTasks = await this.getSpreadsheetService.execute({
      spreadsheetId: '123123',
      range: 'Class Data!A2:E',
    });

    // const spreadsheetOMOPs = await this.getSpreadsheetService.execute({
    //   spreadsheetId: '123123',
    //   range: 'Class Data!A2:E',
    // });

    const tasks = plainToInstance(SpreadsheetTaskModel, spreadsheetTasks);
    // const oMOPs = plainToInstance(SpreadsheetOMOPModel, spreadsheetOMOPs);

    const tasksFormData = await this.createTasksForWorkflowService.execute(
      {},
      'aasdasdas',
      tasks,
      'aasdasdasd',
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
