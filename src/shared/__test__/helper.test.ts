import { container } from 'tsyringe';
import AxiosFacade from '@shared/facades/AxiosFacade';
import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';
import GetAuthorizationFluigUserService, {
  FluigCredentialsType,
} from '@modules/fluig/services/GetAuthorizationFluigUserService';
import { Axios } from 'axios';
import {
  FluigUserModel,
  IFluigUserModel,
} from '@modules/fluig/infra/local/models/FluigUserModel';
import { plainToInstance } from 'class-transformer';
import RegisterUserService from '@modules/fluig/services/RegisterUserService';
import GetUserInformationService from '@modules/fluig/services/GetUserInformationService';

/**
 * Usefull to format requests and requisitions
 * @param axios
 */
export function formatReqResAxiosTester(axios: Axios) {
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

/**
 * Authorize .env test user on Axios instance and register then
 * in repository
 */
export async function authorizeUserAxiosFluigTester(isAxiosDebug?: boolean) {
  // Autorize Fluig User
  const { headers, jWTPayload }: FluigCredentialsType = await container
    .resolve(GetAuthorizationFluigUserService)
    .execute(
      process.env.TEST_FLUIG_USERNAME ?? '',
      process.env.TEST_FLUIG_PASSWORD ?? '',
    );

  // Converte Bear JTW to user model
  const fluigUser: IFluigUserModel = plainToInstance(
    FluigUserModel,
    jWTPayload,
  );

  // Register User service
  container.resolve(RegisterUserService).execute(fluigUser, headers);

  // Get more information about User
  fluigUser.userInfo = await container
    .resolve(GetUserInformationService)
    .execute(fluigUser.userUUID, fluigUser.sub);

  // Get repository from users registered
  const repository =
    container.resolve<IFluigUserRepository>(FluigUserRepository);

  // List all users Registered
  const registeredUsers = repository.list();

  // Get Axios instance with authorized fluig user
  const axiosAuthorizedClient = container
    .resolve(AxiosFacade)
    .container.resolve<Axios>(registeredUsers[0].userUUID);

  if (isAxiosDebug) formatReqResAxiosTester(axiosAuthorizedClient);

  return axiosAuthorizedClient;
}
