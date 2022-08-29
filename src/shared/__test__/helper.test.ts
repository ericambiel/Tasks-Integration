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

export function registerAxiosCleanInstanceFluigTest() {
  return container.resolve(AxiosFacade).axiosFactor({
    baseURL: process.env.FLUIG_BASEURL ?? '',
    Origin: process.env.FLUIG_ORIGIN ?? '',
    // instanceId: 'axiosCleanInstanceFluig',
  });
}

export async function authorizedUserAxiosFluig() {
  // Create clean instance Axios
  const cleanAxios = registerAxiosCleanInstanceFluigTest();

  // Register instance to be used in AuthorizeUserService
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
    {
      excludeExtraneousValues: true,
    },
  );

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

  //
  axiosAuthorizedClient.interceptors.request.use(request => {
    console.log(
      `--- axiosClient Request ---\n${JSON.stringify(request, null, 2)}`,
    );
    return request;
  });

  axiosAuthorizedClient.interceptors.response.use(response => {
    console.log(
      `--- axiosClient Response ---\n${JSON.stringify(response, null, 2)}`,
    );
    return response;
  });

  return axiosAuthorizedClient;
}
