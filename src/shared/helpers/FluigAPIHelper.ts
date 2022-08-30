import { Axios, AxiosRequestConfig } from 'axios';
import { ColleagueInformationDTO } from '@modules/fluig/dtos/ColleagueInformationDTO';
import { URLSearchParams } from 'url';
import { DatasetReqDTO } from '@modules/fluig/dtos/DatasetReqDTO';
import { inject, injectable } from 'tsyringe';
import { DatasetResDTO } from '@modules/fluig/dtos/DatasetResDTO';

// eslint-disable-next-line no-shadow
export enum NameFnEnum {
  OM = 'totvsBuscaOMAptoDematic',
  OP = 'totvsBuscaOPAptoDematic',
  TEC = 'totvsBuscaNomeTecnicoAptoDematic',
}

interface IManagerRes extends DatasetResDTO {
  content: {
    columns: ['codigoProjeto', 'nomeProjeto', 'nomeGestor'];
    values: [
      {
        codigoProjeto: string;
        nomeProjeto: string;
        nomeGestor: string;
      },
    ];
  };
}

interface ITechnician extends DatasetResDTO {
  content: {
    columns: ['nomeTecnico'];
    values: [
      {
        nomeTecnico: string;
      },
    ];
  };
}

@injectable()
export default class FluigAPIHelper {
  constructor(
    @inject(Axios)
    private axios: Axios,
  ) {}

  /**
   * Login user to do request to Fluig
   * @param username
   * @param password
   * @private
   * @author Eric Ambiel
   */
  async loginUser(username: string, password: string): Promise<string> {
    const req = (params: URLSearchParams, config?: AxiosRequestConfig) =>
      this.axios.post('portal/api/servlet/login.do', params.toString(), config);

    const params = new URLSearchParams({
      j_username: username,
      j_password: password,
      keepalive: 'false',
    });

    // Get Cookies
    const {
      headers: { 'set-cookie': setCookie },
    } = await req(params);

    if (!setCookie) throw Error('Not possible acquire cookies from server');

    // Get Bearer token
    const {
      headers: { authorization },
    } = await req(params, { headers: { Cookie: setCookie.toString() } });

    const headers = {
      Cookie: setCookie.toString(),
      Authorization: authorization,
    };

    // Set Bear token / Cookies to all request to this instance
    // eslint-disable-next-line no-param-reassign
    this.axios.defaults.headers.common = headers;

    return headers.Authorization;
  }

  /**
   * Get information from Colleague by userName
   * @param userName
   */
  getColleagueInfo(userName: string) {
    return this.axios
      .get<ColleagueInformationDTO>(
        `ecm/api/rest/ecm/colleague/getColleagueByLogin/?username=${userName}`,
      )
      .then(res => res.data);
  }

  private getDataSet<T>(oMOP: string, searchFor: NameFnEnum) {
    // eslint-disable-next-line no-shadow
    enum FieldEnum {
      totvsBuscaOMAptoDematic = 'codOm',
      totvsBuscaOPAptoDematic = 'codOp',
      totvsBuscaNomeTecnicoAptoDematic = 'codTecnico',
    }

    type OptionsDatasets = {
      name: NameFnEnum;
      constraints: [
        {
          _field: FieldEnum;
          _type: 1;
        },
      ];
    } & DatasetReqDTO;

    const requestDataDataset = (value: string, _searchFor: NameFnEnum) =>
      <OptionsDatasets>{
        name: _searchFor,
        fields: null,
        constraints: [
          {
            // eslint-disable-next-line no-underscore-dangle
            _field: FieldEnum[_searchFor],
            _initialValue: value,
            _finalValue: value,
            _type: 1,
          },
        ],
        order: null,
      };

    return this.axios.post<DatasetResDTO & T>(
      'api/public/ecm/dataset/datasets',
      requestDataDataset(oMOP, searchFor),
    );
  }

  getManagerOMOP(oMOP: string, searchFor: NameFnEnum.OP | NameFnEnum.OM) {
    return this.getDataSet<IManagerRes>(oMOP, searchFor).then(res => res.data);
  }

  getTechnician(technicianCode: string) {
    return this.getDataSet<ITechnician>(technicianCode, NameFnEnum.TEC).then(
      res => res.data,
    );
  }
}
