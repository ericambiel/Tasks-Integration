import { inject, injectable } from 'tsyringe';
import { DatasetsDTO } from '@modules/fluig/dtos/DatasetsDTO';
import { Axios } from 'axios';

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
  constructor(
    @inject(Axios)
    private axios: Axios,
  ) {}

  private requestDataDataset = (oMOP: string, searchFor: NameFnEnum) =>
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

  // TODO: Leave this to facade or helper
  async getManagerOMOP(oMOP: string, searchFor: NameFnEnum) {
    return this.axios.post(
      'api/public/ecm/dataset/datasets',
      this.requestDataDataset(oMOP, searchFor),
      // {
      //   method: 'post',
      //   url: 'https://fluig.kiongroup.com.br/api/public/ecm/dataset/datasets',
      //   headers: {
      //     Host: 'fluig.kiongroup.com.br',
      //     Origin: 'https://fluig.kiongroup.com.br',
      //     // Referer: 'https://fluig.kiongroup.com.br/portal/p/1/home',
      //     'User-Agent':
      //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
      //     Authorization:
      //       'Bearer eyJraWQiOiI3ODgwMjJmZi1jMTg2LTRiNmEtOTcxNC1hNzc1MzJkMjEwYzciLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhbWJpZWxlIiwicm9sZSI6InVzZXIiLCJ0ZW5hbnQiOjEsInVzZXJUZW5hbnRJZCI6MjQ5MywidXNlclR5cGUiOjAsInVzZXJVVUlEIjoiZTFiYTUyYjMtNTU1Ny00NWViLThmOTAtNWZiOWQzMjdiNzU3IiwidGVuYW50VVVJRCI6Ijc4ODAyMmZmLWMxODYtNGI2YS05NzE0LWE3NzUzMmQyMTBjNyIsImxhc3RVcGRhdGVEYXRlIjoxNjYwNzM2ODQ0ODE5LCJ1c2VyVGltZVpvbmUiOiJBbWVyaWNhL1Nhb19QYXVsbyIsImV4cCI6MTY2MTUyMzA5OSwiaWF0IjoxNjYxNTIxODk5LCJhdWQiOiJmbHVpZ19hdXRoZW50aWNhdG9yX3Jlc291cmNlIn0.bFGCU_NfjXFLwii09uNLxnxkAbVbhwkRaeBPJKEdDJxZnxZuP80MSVb-_8GpdS53aupEP-6yQiIcl9lNRbHdPnA3331bMbNtxzQbKz7CCBYvUFJEGi4U08bRGHxce9K91jEaoLnOYl6QRNeWA2KG6WEaCfFZVilrjI8oMtWd6IDJQscb2RE3k6Da6N70UXqRpsr_m5NrzTeyslc8C-MLGC-5w1KEVWIVV2m4LGSBG4eccMMUl163nwi9FZzs6H_5tIaxxWLo6S9ZskNsMngngKXpQKY9uexYxzaCBGDmTrjUE1hFX3tlCqxeetVMSke8qOQ9-1EGrrU-uetk36ZDfQ',
      //     'Content-Type': 'application/json',
      //   },
      // },
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
