import { inject, injectable } from 'tsyringe';
import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';
import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import FluigAPIHelper, { NameFnEnum } from '@shared/helpers/FluigAPIHelper';
import { FormPropertyDTO } from '@modules/fluig/dtos/FormPropertyDTO';

@injectable()
export default class GetMinimumRequiredToWorkflowOMService {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(
    user: IFluigUserModel,
    technicianCode: string,
    oM: string,
    tasks: TaskDTO[],
    descriptionWorkFlow: string,
  ) {
    const manager = await this.fluigAPIHelper.getManagerOMOP(oM, NameFnEnum.OM);
    const technician = await this.fluigAPIHelper.getTechnician(technicianCode);

    return <TaskFormDataDTO>[
      {
        name: 'gerente',
        value: manager.content.values[0].nomeGestor,
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
        value: JSON.stringify(tasks),
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
        value: user.userInfo.userName,
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
          timeZone: user.userTimeZone,
          dateStyle: 'short',
        }).format(new Date()),
      },
      {
        name: 'txtHoraSolicitacao',
        value: new Intl.DateTimeFormat('pt-BR', {
          timeZone: user.userTimeZone,
          timeStyle: 'short',
        }).format(new Date()),
      },
      {
        name: 'tipoApontamento',
        value: 'OM',
      },
      {
        name: 'codTecnico',
        value: technicianCode,
      },
      {
        name: 'nomeTecnico',
        value: technician.content.values[0].nomeTecnico,
      },
      {
        name: 'atividades',
        value: descriptionWorkFlow,
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
      ...this.getFormProperties(tasks),
    ];
  }

  getFormProperties(
    objs: Record<string, string> | Record<string, string>[],
  ): FormPropertyDTO[] {
    const newNameKey = (key: string, idx: number) => `${key}___${idx + 1}`;

    if (Array.isArray(objs))
      return objs
        .map((obj, idx, array) =>
          Object.keys(obj).map(key => ({
            name: newNameKey(key, idx),
            value: array[idx][<keyof typeof obj>key],
          })),
        )
        .flat();

    return Object.keys(objs).map(key => ({
      name: newNameKey(key, 0),
      // https://bobbyhadz.com/blog/typescript-no-index-signature-with-parameter-of-type-string#:~:text=The%20error%20%22No%20index%20signature,keys%20using%20keyof%20typeof%20obj%20.
      value: objs[<keyof typeof objs>key],
    }));
  }
}
