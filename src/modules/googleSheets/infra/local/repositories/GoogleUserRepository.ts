import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import { EventEmitter } from 'events';
import { IGoogleUserRepository, UserTokenInfo } from './IGoogleUserRepository';

const eventEmitter = new EventEmitter();

// TODO: create a class to put all events there, call this class in begin of initialization server
eventEmitter.on('loadUsersTokenFiles', () =>
  console.log('All users token files was loaded.'),
);

/** @author Eric Ambiel */
@singleton<IGoogleUserRepository>()
export default class GoogleUserRepository implements IGoogleUserRepository {
  private usersTokenInfo: UserTokenInfo[];

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
   * @author Eric Ambiel
   */
  private async loadUsersTokenFiles(tokensPath: string): Promise<void> {
    // Get stored token from JSON file
    // TODO: Verify type of file, use JOY/Celebrate
    this.usersTokenInfo = await this.fileHandler.readJSONFilesInDir(tokensPath);
  }

  /**
   * Store the token to disk for later program executions
   * @author Eric Ambiel
   */
  private async saveTokenOnDisk(userInfoToken: UserTokenInfo) {
    return this.fileHandler
      .writeFile(
        `${this.tokensPath}/${userInfoToken.user_information.sub}.token.json`,
        JSON.stringify(userInfoToken),
      )
      .catch((err: Error) => {
        throw new Error(
          `Error saving token: "${userInfoToken.user_information.sub}" to disk: ${err}`,
        );
      });
  }

  deleteBySub(sub: string): void {
    throw new Error(`${sub} - This function not implemented eat`);
  }

  findBySub(sub: string): UserTokenInfo {
    const userToken = this.usersTokenInfo.find(
      userTokenInfo => userTokenInfo.user_information.sub === sub,
    );
    if (userToken) return userToken;
    throw new Error(`Informed sub: ${sub} was not found`);
  }

  list(): UserTokenInfo[] {
    return this.usersTokenInfo;
  }

  save(userInfoToken: UserTokenInfo): void {
    this.usersTokenInfo.push(userInfoToken);
    this.saveTokenOnDisk(userInfoToken).then();
  }
}
