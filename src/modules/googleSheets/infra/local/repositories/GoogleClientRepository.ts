import GoogleAPIFacade, {
  GoogleClientCredentialType,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { EventEmitter } from 'events';
import ConsoleLog from '@libs/ConsoleLog';
import { IGoogleClientRepository } from './IGoogleClientRepository';

@singleton()
export default class GoogleClientRepository
  extends EventEmitter
  implements IGoogleClientRepository
{
  // private clientsCredential: GoogleClientCredential[];

  constructor(
    private clientsCredential: GoogleClientCredentialType[],
    /** Path to credential clients file */
    @inject('clientCredentialFilePath')
    private clientCredentialFilePath: string,
    @inject(FilesHandlerHelper)
    private fileHandler: FilesHandlerHelper,
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
  ) {
    super();
    this.clientsCredential = [];
    this.loadClientsCredentialFile(clientCredentialFilePath).then(() => {
      // Register all loaded clients.
      // P.S.: Clients registered by theirs “client_id” credential.
      this.clientsCredential.forEach(clientCredential =>
        this.googleAPI.oAuth2ClientFactor(clientCredential),
      );
      ConsoleLog.print(
        'All clients credential files loaded.',
        'info',
        'GOOGLECLIENTREPO',
      );
      this.emit('loadedClientsCredentialFiles');
    });
  }

  delete(clientId: string): void {
    throw new Error(`${clientId} - This function not implemented eat`);
  }

  // TODO: Test with instance that doesn't exists, throw error
  findById(clientId: string): OAuth2Client {
    if (this.googleAPI.container.isRegistered(clientId))
      return this.googleAPI.container.resolve(clientId);
    throw ConsoleLog.print(
      'Informed Google Client instanceId not exists',
      'error',
      'GOOGLECLIENTREPO',
    );
  }

  list(): GoogleClientCredentialType[] {
    return this.clientsCredential;
  }

  create(client: GoogleClientCredentialType): void {
    this.clientsCredential.push(client);
    this.googleAPI.oAuth2ClientFactor(client);
    this.saveClientCredentialOnDisk(client).then();
  }

  /**
   * Load Google Service Credential from disk.
   * @param clientCredentialFilePath Path to client credential file.
   * @private
   */
  private async loadClientsCredentialFile(clientCredentialFilePath: string) {
    // Load client secrets from disk file to use in service credential.
    this.clientsCredential = await this.fileHandler
      .readJSONFilesInDir(clientCredentialFilePath)
      .then();
  }

  /**  Save the token on disk for later program executions */
  private async saveClientCredentialOnDisk(
    clientCredential: GoogleClientCredentialType,
  ) {
    return this.fileHandler
      .writeFile(
        // TODO: convert "clientCredential.web.client_id" a HEX before save in disc to avoid erros with wrong name
        `${this.clientCredentialFilePath}/${clientCredential.web.client_id}.client.json`,
        JSON.stringify(clientCredential),
      )
      .catch((err: Error) => {
        throw ConsoleLog.print(
          `Error saving token: "${clientCredential.web.client_id}" to disk: ${err}`,
          'error',
          'GOOGLECLIENTREPO',
        );
      });
  }
}
