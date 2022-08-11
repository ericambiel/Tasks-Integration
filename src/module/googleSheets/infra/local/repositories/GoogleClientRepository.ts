import GoogleServicesFacade, {
  GoogleClientCredential,
} from '@shared/facades/GoogleServicesFacade';
import { OAuth2Client } from 'google-auth-library';
import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import InstanceManagerHelper from '@shared/helpers/InstanceManagerHelper';
import { IGoogleClientRepository } from './IGoogleClientRepository';

@singleton()
export default class GoogleClientRepository implements IGoogleClientRepository {
  constructor(
    /** Path to credential clients file */
    @inject('clientCredentialFilePath')
    private clientCredentialFilePath: string,
    @inject(FilesHandlerHelper)
    private fileHandler: FilesHandlerHelper,
    @inject(GoogleServicesFacade)
    private googleServices: GoogleServicesFacade,
    private clientsCredential: GoogleClientCredential[],
  ) {
    this.loadClientsCredentialFile(clientCredentialFilePath).then(() => {
      // Register all loaded clients.
      // P.S.: Clients are registered by theirs "client_id" credential
      this.clientsCredential.forEach(clientCredential =>
        this.googleServices.clientFactor(clientCredential),
      );
    });
  }

  /**
   * Load Google Service Credential from disk.
   * @param clientCredentialFilePath Path to client credential file
   * @private
   */
  private async loadClientsCredentialFile(clientCredentialFilePath: string) {
    // Load client secrets from a local file to use in service credential.
    this.clientsCredential = await this.fileHandler.readJSONFilesInDir(
      clientCredentialFilePath,
    );
  }

  /**
   * Store the token to disk for later program executions
   */
  private async saveClientCredentialOnDisk(
    clientCredential: GoogleClientCredential,
  ) {
    return this.fileHandler
      .writeFile(
        // TODO: convert "clientCredential.web.client_id" a HEX before save in disc to avoid erros with wrong name
        `${this.clientCredentialFilePath}/${clientCredential.web.client_id}.client.json`,
        JSON.stringify(clientCredential),
      )
      .catch((err: Error) => {
        throw new Error(
          `Error saving token: "${clientCredential.web.client_id}" to disk: ${err}`,
        );
      });
  }

  delete(clientId: string): void {
    throw new Error(`${clientId} - This function not implemented eat`);
  }

  findById(clientId: string): OAuth2Client | undefined {
    return InstanceManagerHelper.getInstanceById(clientId);
  }

  list(): GoogleClientCredential[] {
    return this.clientsCredential;
  }

  save(client: GoogleClientCredential): void {
    this.clientsCredential.push(client);
    this.saveClientCredentialOnDisk(client).then();
  }
}
