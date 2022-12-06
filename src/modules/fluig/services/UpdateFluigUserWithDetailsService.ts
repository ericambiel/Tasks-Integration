import { inject, injectable } from 'tsyringe';
import FluigAPIHelper from '@shared/helpers/FluigAPIHelper';
import { plainToInstance } from 'class-transformer';
import FluigUserInfoModel from '@modules/fluig/infra/local/models/FluigUserInfoModel';
import FluigUserRepository from '@modules/fluig/infra/local/repositories/FluigUserRepository';

@injectable()
export default class UpdateFluigUserWithDetailsService {
  constructor(
    @inject(FluigAPIHelper)
    private fluigAPIHelper: FluigAPIHelper,
    @inject(FluigUserRepository)
    private repository: FluigUserRepository,
  ) {}

  async execute(instanceId: string, userName: string): Promise<void> {
    const { content: userInfo } = await this.fluigAPIHelper.getColleagueInfo(
      instanceId,
      userName,
    );
    const fluigUser = this.repository.findById(instanceId);

    fluigUser.userInfo = plainToInstance(FluigUserInfoModel, userInfo);

    this.repository.update(instanceId, fluigUser);
  }
}
