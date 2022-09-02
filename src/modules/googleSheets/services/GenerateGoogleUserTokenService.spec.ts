import 'reflect-metadata';
import { container } from 'tsyringe';
import { GoogleClientCredential } from '@shared/facades/GoogleAPIFacade';

import { OAuth2Client } from 'google-auth-library';
import GenerateGoogleUserTokenService from './GenerateGoogleUserTokenService';

import clientCredential from '../../../misc/clients/client_secret_331108598412-fmcfkud7cm6hv4qvjc21g37ormjob0qu.apps.googleusercontent.com.json';

describe('Unit test - GenerateGoogleUserTokenService.spec.ts', () => {
  /** Get this code by running AuthorizeGoogleUserService.spec */
  const validationTokenCode =
    '4/0AdQt8qizCKEMgMQSz2YS69FgMmyRgxJkVuw8JhZURX_PjaeFiOI6TQWnbufNjwQ-w5sbPQ';

  const {
    web: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uris: [redirectUri],
    },
  } = <GoogleClientCredential>clientCredential;

  let generateGoogleUserTokenService: GenerateGoogleUserTokenService;

  beforeAll(async () => {
    container.register('tokensPath', { useValue: 'src/misc/tokens' });

    container.registerInstance(
      OAuth2Client,
      new OAuth2Client(clientId, clientSecret, redirectUri),
    );

    generateGoogleUserTokenService = container.resolve(
      GenerateGoogleUserTokenService,
    );
  });

  // // TODO: Move test to test repository.
  // it('Should be possible save token on file', () => {
  //   userRepository.save(newTokenInfoUser);
  // });

  it('Should be possible acquirer an AUTHENTICATED oAuth2Client to Google User', async () => {
    await generateGoogleUserTokenService.execute({
      validationTokenCode,
    });

    const oAuth2Client = container.resolve(OAuth2Client);

    expect(oAuth2Client).toBeInstanceOf(OAuth2Client);
  });
});
