import 'reflect-metadata';
import { container } from 'tsyringe';
import GoogleServicesFacade, {
  GoogleClientCredential,
} from '@shared/facades/GoogleServicesFacade';

import GenerateGoogleUserTokenService from './GenerateGoogleUserTokenService';
import {
  IGoogleUserRepository,
  UserTokenInfo,
} from '../infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

describe('Unit test - GenerateGoogleUserTokenService.spec.ts', () => {
  const validationTokenCode =
    '4/0AdQt8qhsSvTsfjEXyzdlhjuX1P-a25vrKWwB4aZlO4GA-Lz0uhVONBbxwl3NgQf_dhXVVA';
  let instanceId: string;
  let generateGoogleUserTokenService: GenerateGoogleUserTokenService;
  let serviceCredentials: GoogleClientCredential;
  let googleServices: GoogleServicesFacade;
  let newTokenInfoUser: UserTokenInfo;
  let userRepository: IGoogleUserRepository;

  beforeAll(async () => {
    serviceCredentials = await import('../../../misc/credentials.json').then();
    generateGoogleUserTokenService = container.resolve(
      GenerateGoogleUserTokenService,
    );
    googleServices = container.resolve(GoogleServicesFacade);
    userRepository =
      container.resolve<IGoogleUserRepository>(GoogleUserRepository);

    instanceId = googleServices.clientFactor(serviceCredentials);
  });

  it('Should be possible get new token with more information', async () => {
    const { newTokenUser, tokenInfo } =
      await generateGoogleUserTokenService.execute({
        instanceId,
        validationTokenCode,
      });
    newTokenInfoUser = { ...newTokenUser, tokenInfo };
  });

  it('Should be possible save new user token', async () => {
    await userRepository.save(newTokenInfoUser);
  });
});
