import { TokenInfo } from 'google-auth-library';
import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { EventEmitter } from 'events';
import { IGoogleUserRepository, UserTokenInfo } from './IGoogleUserRepository';

const eventEmitter = new EventEmitter();

// TODO: create a class to put all events there, call this class in begin of initialization server
eventEmitter.on('loadUsersTokenFiles', () =>
  console.log('All users token files was loaded.'),
);

@singleton<IGoogleUserRepository>()
export default class GoogleUserRepository implements IGoogleUserRepository {
  private userTokenInfo: UserTokenInfo[];

  constructor(
    @inject('tokensPath')
    private tokensPath: string,
    @inject(FilesHandlerHelper)
    private fileHandler: FilesHandlerHelper,
  ) {
    this.loadUsersTokenFiles(tokensPath).then(() => {
      eventEmitter.emit('loadUsersTokenFiles');
    });
  }

  /**
   * User Token from disk
   * @param tokensPath The path to the user's access and refresh tokens.
   * P.S it will be created automatically when the authorization flow
   * completes for the first time.
   */
  private async loadUsersTokenFiles(tokensPath: string): Promise<void> {
    // Get stored token from JSON file
    // TODO: Verify type of file, use JOY/Celebrate
    this.userTokenInfo = await this.fileHandler.readJSONFilesInDir(tokensPath);
  }

  /**
   * Store the token to disk for later program executions
   */
  private async saveTokenOnDisk(userInfoToken: UserTokenInfo) {
    return this.fileHandler
      .writeFile(
        `${this.tokensPath}/${userInfoToken.token_info.sub}.token.json`,
        JSON.stringify(userInfoToken),
      )
      .catch((err: Error) => {
        throw new Error(
          `Error saving token: "${userInfoToken.token_info.sub}" to disk: ${err}`,
        );
      });
  }

  delete(sub: TokenInfo['sub']): void {
    throw new Error(`${sub} - This function not implemented eat`);
  }

  findBySub(sub: TokenInfo['sub']): UserTokenInfo | undefined {
    return this.userTokenInfo.find(
      userToken => userToken.token_info.sub === sub,
    );
  }

  list(): UserTokenInfo[] {
    return this.userTokenInfo;
  }

  save(userInfoToken: UserTokenInfo): void {
    this.userTokenInfo.push(userInfoToken);
    this.saveTokenOnDisk(userInfoToken).then();
  }
}
