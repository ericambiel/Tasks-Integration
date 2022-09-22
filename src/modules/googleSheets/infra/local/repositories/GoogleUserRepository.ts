import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import ConsoleLog from '@libs/ConsoleLog';
import { api } from '@configs/*';
import { EventEmitter } from 'events';
import { IGoogleUserRepository, UserTokenInfo } from './IGoogleUserRepository';

// const eventEmitter = new EventEmitter();

// eventEmitter.on('loadedUsersTokenFiles', () =>
//   console.log('All users token files was loaded.'),
// );

/** @author Eric Ambiel */
@singleton<IGoogleUserRepository>()
export default class GoogleUserRepository
  extends EventEmitter
  implements IGoogleUserRepository
{
  private readonly apiConfig = api();

  private usersTokenInfo: UserTokenInfo[];

  constructor(
    @inject('tokensPath')
    private tokensPath: string,
    @inject(FilesHandlerHelper)
    private fileHandler: FilesHandlerHelper,
  ) {
    super();
    this.loadUsersTokenFiles(tokensPath).then(() => {
      ConsoleLog.print(
        'All users token files were loaded.',
        'info',
        'GoogleUserRepository',
        this.apiConfig.SILENT,
      );
      this.emit('loadedUsersTokenFiles');
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
