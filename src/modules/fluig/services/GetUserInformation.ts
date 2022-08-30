import { inject, injectable } from 'tsyringe';
import FluigAPIHelper from '@shared/helpers/FluigAPIHelper';
import { plainToInstance } from 'class-transformer';
import FluigUserInfoModel from '@modules/fluig/infra/local/models/FluigUserInfoModel';

@injectable()
export default class GetUserInformation {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
  ) {}

  async execute(userName: string) {
    const { content: userInfo } = await this.fluigAPIHelper.getColleagueInfo(
      userName,
    );

    return plainToInstance(FluigUserInfoModel, userInfo);
  }
}