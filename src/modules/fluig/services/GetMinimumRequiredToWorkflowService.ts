import { Axios, AxiosInstance } from 'axios';

import { inject, injectable } from 'tsyringe';
import { DatasetsDTO } from '@modules/fluig/dtos/DatasetsDTO';

// eslint-disable-next-line no-shadow
export enum NameFnEnum {
  OM = 'totvsBuscaOMAptoDematic',
  OP = 'totvsBuscaOPAptoDematic',
}

// eslint-disable-next-line no-shadow
enum FieldEnum {
  totvsBuscaOMAptoDematic = 'codOm',
  totvsBuscaOPAptoDematic = 'codOp',
}

type OptionsDatasets = {
  name: NameFnEnum;
  constraints: [
    {
      _field: FieldEnum;
      _type: 1;
    },
  ];
} & DatasetsDTO;

@injectable()
export default class GetMinimumRequiredToWorkflowService {
  private requestData = (oMOP: string, searchFor: NameFnEnum) =>
    <OptionsDatasets>{
      name: searchFor,
      fields: null,
      constraints: [
        {
          _field: FieldEnum[searchFor],
          _initialValue: oMOP,
          _finalValue: oMOP,
          _type: 1,
        },
      ],
      order: null,
    };

  constructor(@inject(Axios) private axios: AxiosInstance) {}

  // TODO: Leave this to facade or helper
  async getManagerOMOP(oMOP: string, searchFor: NameFnEnum) {
    return this.axios.post(
      'api/public/ecm/dataset/datasets',
      this.requestData(oMOP, searchFor),
    );
  }

  example() {
    // const taskFormData: TaskFormDataDTO = [{
    //   name: 'gerente',
    //   value: string,
    // },
    //   {
    //     name: 'nomeGerente',
    //     value: '',
    //   },
    //   {
    //     name: 'dtAprovacao',
    //     value: '',
    //   },
    //   {
    //     name: 'horaAprovacao',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentosRealizadosJson',
    //     /**
    //      * All tasks value here in JSON format string (stringify)
    //      */
    //     value: TaskDTO[],
    //   },
    //   {
    //     name: 'apontamentosAprovados',
    //     value: '',
    //   },
    //   {
    //     name: 'solicitacao',
    //     value: '',
    //   },
    //   {
    //     name: 'solicitante',
    //     value: string,
    //   },
    //   {
    //     name: 'txtMatriculaSolicitante',
    //     value: '',
    //   },
    //   {
    //     name: 'txtEmailSolicitante',
    //     value: '',
    //   },
    //   {
    //     name: 'dataSolicitacao',
    //     value: string,
    //   },
    //   {
    //     name: 'txtHoraSolicitacao',
    //     value: string,
    //   },
    //   {
    //     name: 'tipoApontamento',
    //     value: 'OM' | 'OP',
    //   },
    //   {
    //     name: 'codTecnico',
    //     value: string,
    //   },
    //   {
    //     name: 'nomeTecnico',
    //     value: string,
    //   },
    //   {
    //     name: 'atividades',
    //     value: string,
    //   },
    //   {
    //     name: 'observacoes',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoNumeroOM_OP',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoCodOM_OP',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoProjeto',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoOperacaoTarefa',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoData',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoInicio',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoFim',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoHoras',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoObservacao',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoId',
    //     value: '',
    //   },
    //   {
    //     name: 'txtAprovacao',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoNumeroOMOP',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoCodOMOP',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoProjeto',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoOperacaoTarefa',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoOperacaoTarefaNome',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoData',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoInicio',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoFim',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoHoras',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoObservacao',
    //     value: '',
    //   },
    //   {
    //     name: 'realizadoAprovado',
    //     value: '',
    //   },
    //   {
    //     name: 'chkTipoApontamento',
    //     value: '',
    //   },
    //   {
    //     name: 'apontamentoOperacaoTarefaNome',
    //     value: '',
    //   },
    //   {
    //     name: 'aprovadoAprovacaoCheckbox',
    //     value: '',
    //   },
    //   ...TaskSerializedDTO,]
  }
}
