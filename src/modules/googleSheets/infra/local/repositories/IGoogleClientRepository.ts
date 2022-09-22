import { OAuth2Client } from 'google-auth-library';
import { GoogleClientCredential } from '@shared/facades/GoogleAPIFacade';
import { EventEmitter } from 'events';

export interface IGoogleClientRepository extends EventEmitter {
  list(): GoogleClientCredential[];

  findById(clientId: GoogleClientCredential['web']['client_id']): OAuth2Client;

  create(client: GoogleClientCredential): void;

  delete(clientId: GoogleClientCredential['web']['client_id']): void;
}
