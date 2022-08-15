import 'reflect-metadata';
import { container } from 'tsyringe';
import GoogleServicesFacade, {
  GoogleClientCredential,
} from '@shared/facades/GoogleServicesFacade';

import { OAuth2Client } from 'google-auth-library';
import GenerateGoogleUserTokenService from './GenerateGoogleUserTokenService';

describe('Unit test - GenerateGoogleUserTokenService.spec.ts', () => {
  let serviceCredentials: GoogleClientCredential;
  let googleSFacade: GoogleServicesFacade;
  let oAuth2Client: OAuth2Client;
  let generateGoogleUserTokenService: GenerateGoogleUserTokenService;

  /** Get this code by running AuthorizeGoogleUserService.spec */
  const validationTokenCode =
    '4/0AdQt8qjW1tmBFL1DgFwtPV9mUUiO_ejyvXRvzJfA_quftowSgr2UGnzDc0n5sgP6OhAw_w';

  beforeAll(async () => {
    serviceCredentials = await import(
      '../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json'
    ).then();
    googleSFacade = container.resolve(GoogleServicesFacade);
    oAuth2Client = googleSFacade.clientFactor(serviceCredentials);

    container.register('tokensPath', { useValue: 'src/misc/tokens' });

    generateGoogleUserTokenService = container.resolve(
      GenerateGoogleUserTokenService,
    );

    container.register<string>('tokensPath', {
      useValue: 'src/misc/tokens',
    });
  });

  // // TODO: Move test to test repository.
  // it('Should be possible save token on file', () => {
  //   userRepository.save(newTokenInfoUser);
  // });

  it('Should be possible acquirer an AUTHENTICATED oAuth2Client to Google User', async () => {
    oAuth2Client = await generateGoogleUserTokenService.execute({
      validationTokenCode,
      instanceId: serviceCredentials.web.client_id,
    });

    expect(oAuth2Client).toBeInstanceOf(OAuth2Client);
  });
});
