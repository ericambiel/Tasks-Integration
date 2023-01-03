import { inject, injectable } from 'tsyringe';
import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';
import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import FluigAPIHelper, {
  ITechnicianRes,
  NameFnEnum,
} from '@shared/helpers/FluigAPIHelper';
import { anyObjToFormProperties } from '@modules/fluig/helpers/formTaskHelper';
import { groupByPredicate } from '@shared/helpers/smallHelper';
import ICreateFluigTasksService from '@modules/fluig/services/ICreateFluigTasksService';

@injectable()
export default class CreateFluigTasksService
  implements ICreateFluigTasksService
{
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(
    user: IFluigUserModel,
    technicianCode: string,
    tasks: TaskDTO[],
    descriptionWorkFlow: string,
  ) {
    // Get information about technician (name)
    const technician = await this.fluigAPIHelper.getTechnician(
      user.userUUID,
      technicianCode,
    );

    // Get and match manager/task.
    const managers = await Promise.all(
      tasks.map(async task =>
        this.fluigAPIHelper.getManagerOMOP(
          user.userUUID,
          task.realizadoCodOMOP ?? task.realizadoNumeroOMOP,
          NameFnEnum.OM,
        ),
      ),
    );

    // Group tasks by manager name
    const groupTasksManager = groupByPredicate(tasks, value => {
      return (
        managers.find(
          manager =>
            manager.content.values[0].codigoProjeto ===
            value.realizadoNumeroOMOP,
        )?.content.values[0].nomeGestor ?? 'managerNotFound'
      );
    });

    // Return a list of Task Forms to each manager name found.
    return Object.keys(groupTasksManager).map(managerName =>
      this.taskFormDataCreator({
        managerName,
        user,
        technicianCode,
        technician,
        tasks: groupTasksManager[managerName],
        descriptionWorkFlow,
      }),
    );
  }

  // TODO: Make a model for this
  private taskFormDataCreator(options: {
    managerName: string;
    user: IFluigUserModel;
    technicianCode: string;
    technician: ITechnicianRes;
    tasks: TaskDTO[];
    descriptionWorkFlow: string;
  }): TaskFormDataDTO {
    return [
      {
        name: 'gerente',
        value: options.managerName,
      },
      {
        name: 'nomeGerente',
        value: '',
      },
      {
        name: 'dtAprovacao',
        value: '',
      },
      {
        name: 'horaAprovacao',
        value: '',
      },
      {
        name: 'apontamentosRealizadosJson',
        value: JSON.stringify(options.tasks),
      },
      {
        name: 'apontamentosAprovados',
        value: '',
      },
      {
        name: 'solicitacao',
        value: '',
      },
      {
        name: 'solicitante',
        value: options.user.userInfo.userName,
      },
      {
        name: 'txtMatriculaSolicitante',
        value: '',
      },
      {
        name: 'txtEmailSolicitante',
        value: '',
      },
      {
        name: 'dataSolicitacao',
        value: new Intl.DateTimeFormat('pt-BR', {
          timeZone: options.user.userTimeZone,
          dateStyle: 'short',
        }).format(new Date()),
      },
      {
        name: 'txtHoraSolicitacao',
        value: new Intl.DateTimeFormat('pt-BR', {
          timeZone: options.user.userTimeZone,
          timeStyle: 'short',
        }).format(new Date()),
      },
      {
        name: 'tipoApontamento',
        value: 'OM',
      },
      {
        name: 'codTecnico',
        value: options.technicianCode,
      },
      {
        name: 'nomeTecnico',
        value: options.technician.content.values[0].nomeTecnico,
      },
      {
        name: 'atividades',
        value: options.descriptionWorkFlow,
      },
      {
        name: 'observacoes',
        value: '',
      },
      {
        name: 'apontamentoNumeroOM_OP',
        value: '',
      },
      {
        name: 'apontamentoCodOM_OP',
        value: '',
      },
      {
        name: 'apontamentoProjeto',
        value: '',
      },
      {
        name: 'apontamentoOperacaoTarefa',
        value: '',
      },
      {
        name: 'apontamentoData',
        value: '',
      },
      {
        name: 'apontamentoInicio',
        value: '',
      },
      {
        name: 'apontamentoFim',
        value: '',
      },
      {
        name: 'apontamentoHoras',
        value: '',
      },
      {
        name: 'apontamentoObservacao',
        value: '',
      },
      {
        name: 'realizadoId',
        value: '',
      },
      {
        name: 'txtAprovacao',
        value: '',
      },
      {
        name: 'realizadoNumeroOMOP',
        value: '',
      },
      {
        name: 'realizadoCodOMOP',
        value: '',
      },
      {
        name: 'realizadoProjeto',
        value: '',
      },
      {
        name: 'realizadoOperacaoTarefa',
        value: '',
      },
      {
        name: 'realizadoOperacaoTarefaNome',
        value: '',
      },
      {
        name: 'realizadoData',
        value: '',
      },
      {
        name: 'realizadoInicio',
        value: '',
      },
      {
        name: 'realizadoFim',
        value: '',
      },
      {
        name: 'realizadoHoras',
        value: '',
      },
      {
        name: 'realizadoObservacao',
        value: '',
      },
      {
        name: 'realizadoAprovado',
        value: '',
      },
      {
        name: 'chkTipoApontamento',
        value: '',
      },
      {
        name: 'apontamentoOperacaoTarefaNome',
        value: '',
      },
      {
        name: 'aprovadoAprovacaoCheckbox',
        value: '',
      },
      ...anyObjToFormProperties(options.tasks),
    ];
  }
}
