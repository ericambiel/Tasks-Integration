import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';
import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';

export default interface ICreateFluigTasksService {
  execute(
    user: IFluigUserModel,
    technicianCode: string,
    tasks: TaskDTO[],
    descriptionWorkFlow: string,
  ): Promise<TaskFormDataDTO[]>;
}
