import 'reflect-metadata';
import { container } from 'tsyringe';
import { GoogleClientCredential } from '@shared/facades/GoogleServicesFacade';

import { Credentials } from 'google-auth-library';
import AuthorizeGoogleClientServer from './AuthorizeGoogleClientServer';
import { IGoogleClientRepository } from '../infra/local/repositories/IGoogleClientRepository';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import { IGoogleUserRepository } from '../infra/local/repositories/IGoogleUserRepository';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

describe('Unit test - AuthorizeGoogleUserService.ts', () => {
  // TODO: Export o helper
  /** HTTP/HTTPs expression validation */
  const expression =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.\S{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.\S{2,}|www\.[a-zA-Z0-9]+\.\S{2,})/gi;
  const regex = new RegExp(expression);

  // TODO: Export o helper
  /* Simulate event emitter, in real scenario server wait for load files called by event */
  const sleep = (mSeconds: number) =>
    new Promise(resolve => {
      setTimeout(resolve, mSeconds);
    });

  let clientsCredential: GoogleClientCredential[];
  let usersToken: Credentials[];

  let repositoryClient: IGoogleClientRepository;
  let repositoryUser: IGoogleUserRepository;
  let serviceAuth: AuthorizeGoogleClientServer;

  beforeAll(async () => {
    container.register<string>('clientCredentialFilePath', {
      useValue: 'src/misc/clients',
    });
    container.register<string>('tokensPath', {
      useValue: 'src/misc/tokens',
    });

    repositoryClient = await container.resolve<IGoogleClientRepository>(
      GoogleClientRepository,
    );
    repositoryUser = await container.resolve<IGoogleUserRepository>(
      GoogleUserRepository,
    );

    serviceAuth = container.resolve(AuthorizeGoogleClientServer);
  });

  it('Should be possible return authorization for Google User if token not informed', async () => {
    await sleep(50);

    clientsCredential = repositoryClient.list();

    const uRL: string = <string>await serviceAuth.execute({
      clientId: clientsCredential[0].web.client_id,
    });

    // Match if uRL is a URL
    expect(uRL.match(regex)).toContain(uRL);
  });

  it('Should be possible return authorization for Google User if stored token is wrong', async () => {
    await sleep(50);

    clientsCredential = repositoryClient.list();
    usersToken = repositoryUser.list();

    const uRL: string = <string>await serviceAuth.execute({
      clientId: clientsCredential[0].web.client_id,
      userToken: usersToken[0],
    });

    // Match if uRL is a URL
    expect(uRL.match(regex)).toContain(uRL);
  });
});
