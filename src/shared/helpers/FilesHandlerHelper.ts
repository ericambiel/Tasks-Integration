import Buffer from 'buffer';
import fs from 'fs';
import { container, singleton } from 'tsyringe';
import { Credentials, TokenInfo } from 'google-auth-library';
import {
  GoogleServiceCredential,
  Option,
} from '@shared/facades/GoogleServicesFacade';

type LoadCredentialsFilesOption = {
  /** Path to credentials file */
  credentialFilePath: string;
  /**
   *  The path to the user's access and refresh tokens. P.S it will be
   *  created automatically when the authorization flow completes for the first time.
   */
  tokensPath: Option['tokensPath'];
  /** A token that can be sent to a Google API */
  accessToken: Credentials['access_token'];
};

export type SaveTokenOnDiskOptions = {
  /**
   *  The path to the user's access and refresh tokens. P.S it will be
   *  created automatically when the authorization flow completes for the first time.
   */
  tokensPath: Option['tokensPath'];
  newTokenInfoUser: TokenInfo & Credentials;
};

@singleton()
export default class FilesHandlerHelper {
  async readFile(filePath: string): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        console.log(`Reading file: ${filePath}`);
        resolve(data);
      });
    });
  }

  async writeFile(filePath: string, data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, data, err => {
        if (err) reject(err);
        console.log(`File are storing to: ${filePath}`);
        resolve();
      });
    }).catch(err => {
      throw new Error(`Error in write to a file: ${err}`);
    });
  }

  /**
   * Load Google Service Credential and User Token from disk
   * @param options
   */
  async loadCredentialsFiles(options: LoadCredentialsFilesOption) {
    const filesHandlerHelper = container.resolve(FilesHandlerHelper);
    // Load client secrets from a local file.
    const credentialsFileBuffer: Buffer = await filesHandlerHelper
      .readFile(`${options.credentialFilePath}`) // TODO: Use path to verify correct S.O.
      .catch((e: Error) => {
        throw new Error(`Loading client secret file: ${e}`);
      });

    // Load previously stored a token.
    const tokenFileBuffer = await filesHandlerHelper.readFile(
      `${options.tokensPath}/token.json`,
      // `${options.credentialFilePath}/${options.accessToken}.json`, // TODO: Use path to verify correct S.O.
    );

    // Parse stored token
    const token: Credentials = JSON.parse(tokenFileBuffer.toString()); // TODO: Verify type of file, use JOY/Celebrate

    // Parse stored credential
    const serviceCredentials: GoogleServiceCredential = JSON.parse(
      credentialsFileBuffer.toString(),
    );

    return { serviceCredentials, token };
  }

  /**
   * Store the token to disk for later program executions
   */
  async saveTokenOnDisk(options: SaveTokenOnDiskOptions) {
    const filesHandlerHelper = container.resolve(FilesHandlerHelper);
    return filesHandlerHelper.writeFile(
      `${options.tokensPath}/${options.newTokenInfoUser.user_id}.token.json`, // TODO: Apply Path resolve
      JSON.stringify(options.newTokenInfoUser),
    );
  }
}
