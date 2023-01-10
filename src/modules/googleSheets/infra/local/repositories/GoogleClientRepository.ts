import GoogleAPIFacade, {
  GoogleClientCredentialType,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import ConsoleLog from '@libs/ConsoleLog';
import { api } from '@configs/*';
import googleApi from '@config/googleApi';
import { IGoogleClientRepository } from './IGoogleClientRepository';

@singleton()
// extends EventEmitter
export default class GoogleClientRepository implements IGoogleClientRepository {
  private readonly API_CONFIG = api();

  private readonly GOOGLE_API_CONF = googleApi();

  constructor(
    @inject('GoogleClientCredentialType')
    private clientsCredential: GoogleClientCredentialType[],
    @inject(FilesHandlerHelper)
    private fileHandler: FilesHandlerHelper,
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
  ) {
    this.createOAuth2Clients();
  }

  delete(clientId: string): void {
    throw new Error(`${clientId} - This function not implemented eat`);
  }

  // TODO: Test with instance that doesn't exists, throw error
  findById(clientId: string): OAuth2Client {
    if (this.googleAPI.container.isRegistered(clientId))
      return this.googleAPI.container.resolve(clientId);
    throw ConsoleLog.print(
      `Informed Google Client instanceId: ${clientId}, not exists`,
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
   * @private
   */
  async loadCredentialsFromDisk(): Promise<void> {
    // Load client secrets from disk file to use in service credential.
    this.clientsCredential = await this.fileHandler.readJSONFilesInDir(
      this.GOOGLE_API_CONF.CLIENTS_PATH,
    );

    this.createOAuth2Clients();

    ConsoleLog.print(
      'All clients credential files loaded.',
      'info',
      'GOOGLECLIENTREPO',
      this.API_CONFIG.SILENT_MODE,
    );
  }

  /**
   * Reload from array and register all loaded clients
   * P.S.: Clients registered by theirs “client_id” credential.
   * @private
   */
  private createOAuth2Clients() {
    this.clientsCredential.forEach(clientCredential =>
      this.googleAPI.oAuth2ClientFactor(clientCredential),
    );
  }

  /**  Save the token on disk for later program executions */
  private async saveClientCredentialOnDisk(
    clientCredential: GoogleClientCredentialType,
  ) {
    return this.fileHandler
      .writeFile(
        // TODO: convert "clientCredential.web.client_id" a HEX before save in disc to avoid erros with wrong name
        `${this.GOOGLE_API_CONF.CLIENTS_PATH}/${clientCredential.web.client_id}.client.json`,
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
