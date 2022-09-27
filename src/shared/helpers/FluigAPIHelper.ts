import { Axios, AxiosRequestConfig } from 'axios';
import { ColleagueInformationDTO } from '@modules/fluig/dtos/ColleagueInformationDTO';
import { URLSearchParams } from 'url';
import { DatasetReqDTO } from '@modules/fluig/dtos/DatasetReqDTO';
import { inject, singleton } from 'tsyringe';
import { DatasetResDTO } from '@modules/fluig/dtos/DatasetResDTO';
import ConsoleLog from '@libs/ConsoleLog';
import AxiosFacade from '@shared/facades/AxiosFacade';
import fluigApi from '@config/fluigApi';

// eslint-disable-next-line no-shadow
export enum NameFnEnum {
  OM = 'totvsBuscaOMAptoDematic',
  OP = 'totvsBuscaOPAptoDematic',
  TEC = 'totvsBuscaNomeTecnicoAptoDematic',
}

export interface IManagerRes extends DatasetResDTO {
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

export interface ITechnicianRes extends DatasetResDTO {
  content: {
    columns: ['nomeTecnico'];
    values: [
      {
        nomeTecnico: string;
      },
    ];
  };
}

export type AuthHeaders = {
  Cookie: string;
  Authorization: string;
};
const fluigApiConf = fluigApi();

@singleton()
export default class FluigAPIHelper {
  private axiosInstance = (instanceId: string) =>
    this.axiosFacade.container.resolve<Axios>(instanceId);

  constructor(
    @inject(AxiosFacade)
    private axiosFacade: AxiosFacade,
  ) {
    axiosFacade.axiosFactor({
      baseURL: fluigApiConf.BASEURL,
      Origin: fluigApiConf.ORIGIN,
      instanceId: 'loginInstance',
    });
  }

  /**
   * Login user to do request to Fluig
   * @param username
   * @param password
   * @private
   * @author Eric Ambiel
   */
  async loginUser(username: string, password: string): Promise<AuthHeaders> {
    const req = (params: URLSearchParams, config?: AxiosRequestConfig) =>
      this.axiosInstance('loginInstance').post(
        'portal/api/servlet/login.do',
        params.toString(),
        config,
      );

    const params = new URLSearchParams({
      j_username: username,
      j_password: password,
      keepalive: 'false',
    });

    // Get Cookies
    const {
      headers: { 'set-cookie': setCookie },
    } = await req(params);

    if (!setCookie)
      throw ConsoleLog.print('Not possible acquire cookies from server');

    // Get Bearer token
    const {
      headers: { authorization },
    } = await req(params, { headers: { Cookie: setCookie.toString() } });

    return {
      Cookie: setCookie.toString(),
      Authorization: authorization,
    };

    // Set Bear token / Cookies to all request to this instance
    // eslint-disable-next-line no-param-reassign
    // this.axios.defaults.headers.common = headers;

    // return headers.Authorization;
  }

  /**
   * Get information from Colleague by userName
   * @param instanceId Axios instance ID
   * @param userName
   */
  getColleagueInfo(instanceId: string, userName: string) {
    return this.axiosInstance(instanceId)
      .get<ColleagueInformationDTO>(
        `ecm/api/rest/ecm/colleague/getColleagueByLogin/?username=${userName}`,
      )
      .then(res => res.data);
  }

  private getDataSet<T>(
    instanceId: string,
    oMOP: string,
    searchFor: NameFnEnum,
  ) {
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

    return this.axiosInstance(instanceId).post<DatasetResDTO & T>(
      'api/public/ecm/dataset/datasets',
      requestDataDataset(oMOP, searchFor),
    );
  }

  getManagerOMOP(
    instanceId: string,
    oMOP: string,
    searchFor: NameFnEnum.OP | NameFnEnum.OM,
  ): Promise<IManagerRes> {
    return this.getDataSet<IManagerRes>(instanceId, oMOP, searchFor).then(
      res => res.data,
    );
  }

  getTechnician(
    instanceId: string,
    technicianCode: string,
  ): Promise<ITechnicianRes> {
    return this.getDataSet<ITechnicianRes>(
      instanceId,
      technicianCode,
      NameFnEnum.TEC,
    ).then(res => res.data);
  }
}
