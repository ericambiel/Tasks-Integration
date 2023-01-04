import { OAuth2Client } from 'google-auth-library';
import { GoogleClientCredentialType } from '@shared/facades/GoogleAPIFacade';
import { EventEmitter } from 'events';

export interface IGoogleClientRepository extends EventEmitter {
  list(): GoogleClientCredentialType[];

  findById(
    clientId: GoogleClientCredentialType['web']['client_id'],
  ): OAuth2Client;

  create(client: GoogleClientCredentialType): void;

  delete(clientId: GoogleClientCredentialType['web']['client_id']): void;
}
