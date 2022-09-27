import {
  FluigUserModel,
  IFluigUserModel,
} from '@modules/fluig/infra/local/models/FluigUserModel';

/**
 * Fluig User Repository.
 * All registers users are volatile,
 * will be lost with every API initialize.
 * @author Eric Ambiel */
export interface IFluigUserRepository {
  /**
   * List all registered Fluig user.
   * @author Eric Ambiel
   */
  list(): IFluigUserModel[];

  /**
   * Find Fluig user by userUUID.
   * @param userUUID This acquired by the decoded JWT.
   * @author Eric Ambiel
   */
  findById(userUUID: string): IFluigUserModel;

  /**
   * Create a new user in the API, which
   * will be used to manage new requests
   * to fluig.
   * @param user Object fluig user acquired part of the decoded JWT
   * @author Eric Ambiel
   */
  create(user: IFluigUserModel): void;

  update(userUUID: string, user: FluigUserModel): void;

  /**
   * Delete user in this API.
   * @param userUUID This acquired by the decoded JWT.
   * @author Eric Ambiel
   */
  delete(userUUID: string): void;
}
