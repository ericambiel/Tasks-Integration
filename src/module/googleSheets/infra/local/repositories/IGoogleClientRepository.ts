import { OAuth2Client } from 'google-auth-library';
import { GoogleClientCredential } from '@shared/facades/GoogleServicesFacade';

export interface IGoogleClientRepository {
  list(): GoogleClientCredential[];

  findById(clientId: GoogleClientCredential['web']['client_id']): OAuth2Client;

  create(client: GoogleClientCredential): void;

  delete(clientId: GoogleClientCredential['web']['client_id']): void;
}
