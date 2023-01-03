import { FluigUserModel } from '@modules/fluig/infra/local/models/FluigUserModel';

export default interface IGetFluigUserService {
  execute(userUUID: string): FluigUserModel;
}
