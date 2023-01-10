import { inject, singleton } from 'tsyringe';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';
import ConsoleLog from '@libs/ConsoleLog';
import { api } from '@configs/*';
import googleApi from '@config/googleApi';
import {
  IGoogleUserRepository,
  UserTokenInfoType,
} from './IGoogleUserRepository';

/** @author Eric Ambiel */
@singleton<IGoogleUserRepository>()
export default class GoogleUserRepository implements IGoogleUserRepository {
  private readonly API_CONFIG = api();

  private readonly GOOGLE_API_CONF = googleApi();

  constructor(
    @inject('UserTokenInfoType')
    private usersTokenInfo: UserTokenInfoType[],
    @inject(FilesHandlerHelper)
    private fileHandler: FilesHandlerHelper,
  ) {}

  deleteBySub(sub: string): void {
    throw new Error(`${sub} - This function not implemented eat`);
  }

  findBySub(sub: string): UserTokenInfoType {
    const userToken = this.usersTokenInfo.find(
      userTokenInfo => userTokenInfo.user_information.sub === sub,
    );
    if (userToken) return userToken;
    throw new Error(`Informed Google sub: ${sub} was not found`);
  }

  list(): UserTokenInfoType[] {
    return this.usersTokenInfo;
  }

  save(userInfoToken: UserTokenInfoType): void {
    this.usersTokenInfo.push(userInfoToken);
    this.saveTokenOnDisk(userInfoToken).then();
  }

  /**
   * Load Users Token from disk
   * @author Eric Ambiel
   */
  async loadTokensFromDisk(): Promise<void> {
    // Get stored token from JSON file
    // TODO: Verify type of file, use JOY/Celebrate
    this.usersTokenInfo = await this.fileHandler
      .readJSONFilesInDir(this.GOOGLE_API_CONF.TOKENS_PATH)
      .then(buffer => {
        ConsoleLog.print(
          'All users token files were loaded.',
          'info',
          'GoogleUserRepo',
          this.API_CONFIG.SILENT_MODE,
        );
        return buffer;
      });
  }

  /**
   * Store the token to disk for later program executions
   * @author Eric Ambiel
   */
  private async saveTokenOnDisk(userInfoToken: UserTokenInfoType) {
    return this.fileHandler
      .writeFile(
        `${this.GOOGLE_API_CONF.TOKENS_PATH}/${userInfoToken.user_information.sub}.token.json`,
        JSON.stringify(userInfoToken),
      )
      .catch((err: Error) => {
        throw new Error(
          `Error saving token: "${userInfoToken.user_information.sub}" to disk: ${err}`,
        );
      });
  }
}
