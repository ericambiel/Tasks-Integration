import 'reflect-metadata';
import { container } from 'tsyringe';
import { GoogleClientCredential } from '@shared/facades/GoogleAPIFacade';

import { Credentials } from 'google-auth-library';
import { sleep } from '@shared/helpers/smallHelper';
import AuthorizeUserToClientGoogleServerService from './AuthorizeUserToClientGoogleServerService';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleUserRepository } from '../infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

describe('Unit test - AuthorizeGoogleUserService.ts', () => {
  /** HTTP/HTTPs expression validation */
  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/gi;
  // const regex = new RegExp(expression);

  let clientsCredential: GoogleClientCredential[];
  let usersToken: Credentials[];

  let repositoryClient: IGoogleClientRepository;
  let repositoryUser: IGoogleUserRepository;
  let serviceAuth: AuthorizeUserToClientGoogleServerService;

  beforeAll(() => {
    container.register<string>('clientCredentialFilePath', {
      useValue: 'src/misc/clients',
    });
    container.register<string>('tokensPath', {
      useValue: 'src/misc/tokens',
    });

    repositoryClient = container.resolve<IGoogleClientRepository>(
      GoogleClientRepository,
    );
    repositoryUser =
      container.resolve<IGoogleUserRepository>(GoogleUserRepository);

    serviceAuth = container.resolve(AuthorizeUserToClientGoogleServerService);
  });

  beforeEach(async () => {
    await sleep(50);

    clientsCredential = repositoryClient.list();
    usersToken = repositoryUser.list();
  });

  it('Should be possible authorize a client to access a Google User contents', async () => {
    await serviceAuth.execute({
      clientId: clientsCredential[0].web.client_id,
      userToken: usersToken[0],
    });
  });

  it('Should be possible catch url authorization for Google User if stored token is wrong', async () => {
    usersToken[0].refresh_token = undefined;

    const asyncFunc = () =>
      serviceAuth.execute({
        clientId: clientsCredential[0].web.client_id,
        userToken: usersToken[0],
      });

    // Match if uRL is a URL
    // expect(uRL.match(regex)).toContain(uRL);
    await expect(asyncFunc()).rejects.toThrow(expression);
  });
});
