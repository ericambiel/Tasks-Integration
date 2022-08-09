import 'reflect-metadata';
import { container } from 'tsyringe';
import GoogleServicesFacade, {
  GoogleServiceCredential,
} from '@shared/facades/GoogleServicesFacade';

import FilesHandlerHelper, {
  SaveTokenOnDiskOptions,
} from '@shared/helpers/FilesHandlerHelper';
import GenerateGoogleUserTokenService from './GenerateGoogleUserTokenService';

describe('Unit test - GenerateGoogleUserTokenService.spec.ts', () => {
  const validationTokenCode =
    '4/0AdQt8qj91Q4duzQauMWOF0WIGr0SV18QHwU_tCZJjDFgmt7OvqZgNR3GmOIZTjX3gEt4Dg';
  let instanceId: string;
  let generateGoogleUserTokenService: GenerateGoogleUserTokenService;
  let serviceCredentials: GoogleServiceCredential;
  let filesHandlerHelper: FilesHandlerHelper;
  let googleServices: GoogleServicesFacade;
  let newTokenInfoUser: SaveTokenOnDiskOptions['newTokenInfoUser'];

  beforeAll(async () => {
    serviceCredentials = await import('../../../misc/credentials.json').then();
    generateGoogleUserTokenService = container.resolve(
      GenerateGoogleUserTokenService,
    );
    googleServices = container.resolve(GoogleServicesFacade);
    filesHandlerHelper = container.resolve(FilesHandlerHelper);

    instanceId = googleServices.clientFactor(serviceCredentials);
  });

  it('Should be possible get new token with more information', async () => {
    const { newTokenUser, tokenInfo } =
      await generateGoogleUserTokenService.execute({
        instanceId,
        validationTokenCode,
      });
    newTokenInfoUser = { ...newTokenUser, ...tokenInfo };
  });

  it('Should be possible save new user token', async () => {
    await filesHandlerHelper.saveTokenOnDisk({
      tokensPath: 'src/misc',
      newTokenInfoUser,
    });
  });
});
