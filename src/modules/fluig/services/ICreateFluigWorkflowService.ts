import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';
import { WorkflowTaskDTO } from '@modules/fluig/dtos/WorkflowTaskDTO';

export default interface ICreateFluigWorkflowService {
  execute(
    tasksFormData: TaskFormDataDTO[],
    taskUserId: WorkflowTaskDTO['taskUserId'],
  ): WorkflowTaskDTO[];
}
