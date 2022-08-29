import { IFluigUserRepository } from '@modules/fluig/infra/local/repositories/IFluigUserRepository';
import {
  FluigUserModel,
  IFluigUserModel,
} from '@modules/fluig/infra/local/models/FluigUserModel';
import { singleton } from 'tsyringe';

@singleton()
export default class FluigUserRepository implements IFluigUserRepository {
  /** Array with registered Fluig users to this API */
  private fluigUsers: IFluigUserModel[] = [];

  // constructor(
  //     /** Array with registered Fluig users to this API */
  //     @injectAll('IFluigUserModel')
  //     private fluigUsers: FluigUserModel[],
  // ) {}

  create(user: FluigUserModel): void {
    this.fluigUsers.push(user);
  }

  delete(_userUUID: string): void {
    throw new Error('Delete not implemented eat');
  }

  findById(userUUID: string): FluigUserModel {
    const fluigUser = this.fluigUsers.find(user => user.userUUID === userUUID);
    if (fluigUser) return fluigUser;
    throw new Error('userUUID not found');
  }

  list(): FluigUserModel[] {
    return this.fluigUsers;
  }
}
