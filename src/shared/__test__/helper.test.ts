import { container } from 'tsyringe';
import AxiosFacade from '@shared/facades/AxiosFacade';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import AuthorizeUserService from '@modules/fluig/services/AuthorizeUserService';
import { Axios } from 'axios';
import {
  FluigUserModel,
  IFluigUserModel,
} from '@modules/fluig/infra/local/models/FluigUserModel';
import { plainToInstance } from 'class-transformer';
import RegisterUserService from '@modules/fluig/services/RegisterUserService';
import GetUserInformation from '@modules/fluig/services/GetUserInformation';

function treatAxios(axios: Axios) {
  axios.interceptors.request.use(req => {
    const headers = {
      // @ts-ignore
      ...req.headers.common,
      // @ts-ignore
      ...req.headers[req.method],
      ...req.headers,
    };

    ['common', 'get', 'post', 'head', 'put', 'patch', 'delete'].forEach(
      header => {
        delete headers[header];
      },
    );

    const printable = `${new Date()} | Request: ${req.method?.toUpperCase()} | ${
      req.url
    }\n-- HEADERS --\n${JSON.stringify(
      headers,
      null,
      2,
    )}\n-- DATA --\n${JSON.stringify(req.data, null, 2)}`;

    console.log(printable);

    return req;
  });

  axios.interceptors.response.use(res => {
    const printable = `${new Date()} | Response: ${
      res.status
    }\n--DATA--\n${JSON.stringify(res.data, null, 2)}`;

    console.log(printable);

    return res;
  });
}

export function registerAxiosCleanInstanceFluigTest() {
  return container.resolve(AxiosFacade).axiosFactor({
    baseURL: process.env.FLUIG_BASEURL ?? '',
    Origin: process.env.FLUIG_ORIGIN ?? '',
    // instanceId: 'axiosCleanInstanceFluig',
  });
}

export async function authorizeUserAxiosFluig() {
  // Create clean instance Axios
  const cleanAxios = registerAxiosCleanInstanceFluigTest();

  // Register instance to be used in FluigAPIHelper
  container.registerInstance(Axios, cleanAxios);

  // Autorize Fluig User
  const authorization = await container
    .resolve(AuthorizeUserService)
    .execute(
      process.env.FLUIG_USERNAME ?? '',
      process.env.FLUIG_PASSWORD ?? '',
    );

  // Converte Bear JTW to user model
  const fluigUser: IFluigUserModel = plainToInstance(
    FluigUserModel,
    authorization,
  );

  // Get more information about User
  fluigUser.userInfo = await container
    .resolve(GetUserInformation)
    .execute(fluigUser.sub);

  // Register User in the system (Repository and Axios)
  // container.register<IFluigUserModel[]>('IFluigUserModel', {
  //   useValue: [],
  // });
  container.resolve(RegisterUserService).execute(fluigUser);

  // Get repository from users registered
  const repository =
    container.resolve<IFluigUserRepository>(FluigUserRepository);

  // List all users Registered
  const registeredUsers = repository.list();

  // Get Axios instance with authorized fluig user
  const axiosAuthorizedClient = container
    .resolve(AxiosFacade)
    .container.resolve<Axios>(registeredUsers[0].userUUID);

  treatAxios(axiosAuthorizedClient);

  return axiosAuthorizedClient;
}
