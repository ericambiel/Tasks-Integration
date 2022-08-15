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
  let instanceId: string;
  let generateGoogleUserTokenService: GenerateGoogleUserTokenService;
  let serviceCredentials: GoogleClientCredential;
  let googleSFacade: GoogleServicesFacade;
  let newTokenInfoUser: UserTokenInfo;
  let userRepository: IGoogleUserRepository;

  /** Get this code by running AuthorizeGoogleUserService.spec */
  const validationTokenCode =
    '4/0AdQt8qgE8-SAXAPe2sK87g643qPBFicRgNZioRsnqavo__mCLoS4XjvnZp39VXeEyPUH4g';

  const userTokenInfoSchema: UserTokenInfo = {
    refresh_token: expect.any(String),
    scope: expect.any(String),
    token_type: 'Bearer',
    id_token: expect.any(String),
    expiry_date: expect.any(Number),
    tokenInfo: {
      expiry_date: expect.any(Number),
      scopes: expect.arrayContaining([
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/userinfo.profile',
      ]),
      azp: expect.any(String),
      aud: expect.any(String),
      sub: expect.any(String),
      exp: expect.any(String),
      access_type: 'offline',
    },
  };

  beforeAll(async () => {
    serviceCredentials = await import(
      '../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json'
    ).then();
    googleSFacade = container.resolve(GoogleServicesFacade);
    instanceId = googleSFacade.clientFactor(serviceCredentials);

    generateGoogleUserTokenService = container.resolve(
      GenerateGoogleUserTokenService,
    );

    container.register<string>('tokensPath', {
      useValue: 'src/misc/tokens',
    });
    userRepository =
      container.resolve<IGoogleUserRepository>(GoogleUserRepository);
  });

  it('Should be possible get new token', async () => {
    const { newTokenUser, tokenInfo } =
      await generateGoogleUserTokenService.execute({
        instanceId,
        validationTokenCode,
      });
    newTokenInfoUser = { ...newTokenUser, tokenInfo };

    expect(newTokenInfoUser).toMatchObject(userTokenInfoSchema);
  });

  it('Should be possible save new user token on file', () => {
    userRepository.save(newTokenInfoUser);
  });
});
