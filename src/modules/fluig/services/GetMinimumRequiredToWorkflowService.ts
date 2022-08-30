import { inject, injectable } from 'tsyringe';
import { TaskFormDataDTO } from '@modules/fluig/dtos/TaskFormDataDTO';
import { TaskDTO } from '@modules/fluig/dtos/TaskDTO';
import { IFluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';
import FluigAPIHelper, { NameFnEnum } from '@shared/helpers/FluigAPIHelper';

@injectable()
export default class GetMinimumRequiredToWorkflowService {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(
    tasks: TaskDTO[],
    user: IFluigUserModel,
    oMOP: string,
    searchFor: NameFnEnum.OP | NameFnEnum.OM,
    technicianCode: string,
  ) {
    const manager = await this.fluigAPIHelper.getManagerOMOP(oMOP, searchFor);
    const technician = await this.fluigAPIHelper.getTechnician(technicianCode);

    // TODO: Stop here, need implementing integration(module) services ande controller

    const taskFormData: TaskFormDataDTO = [
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
        value: new Date().toLocaleDateString('pt-BR'),
      },
      {
        name: 'txtHoraSolicitacao',
        value: new Date().toLocaleTimeString('pt-BR'),
        // value: new Intl.DateTimeFormat('pt-BR', {
        //   timeZone: 'America/Sao_Paulo',
        //   dateStyle: 'short',
        //   timeStyle: 'short',
        // }).format(new Date()),
      },
      {
        name: 'tipoApontamento',
        value: Object.keys(searchFor).toString(),
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
        value: string,
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
      // ...TaskSerializedDTO,
    ];
  }
}
