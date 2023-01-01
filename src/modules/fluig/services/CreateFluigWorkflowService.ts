import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';

export default class CreateFluigWorkflowService {
  execute(
    tasksFormData: TaskFormDataDTO[],
    taskUserId: WorkflowTaskDTO['taskUserId'],
  ): WorkflowTaskDTO[] {
    return tasksFormData.map(taskFormData =>
      this.makeWorkflowTaskObj(taskFormData, taskUserId),
    );
  }

  private makeWorkflowTaskObj(
    formData: TaskFormDataDTO,
    taskUserId: WorkflowTaskDTO['taskUserId'],
  ): WorkflowTaskDTO {
    return {
      processInstanceId: 0,
      processId: '047',
      version: 5,
      taskUserId,
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
      formData,
      isDigitalSigned: false,
      versionDoc: 0,
      selectedState: 12,
      internalFields: [],
      transferTaskAfterSelection: false,
      currentState: 1,
    };
  }
}
