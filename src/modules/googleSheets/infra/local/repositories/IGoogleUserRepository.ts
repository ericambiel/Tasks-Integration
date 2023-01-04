import { Credentials } from 'google-auth-library';
import GoogleUserInformationModel from '@modules/googleSheets/infra/local/models/GoogleUserInformationModel';
import { EventEmitter } from 'events';

/** @author Eric Ambiel */
export type UserTokenInfoType = Credentials & {
  user_information: GoogleUserInformationModel;
};

/** @author Eric Ambiel */
export interface IGoogleUserRepository extends EventEmitter {
  /** @author Eric Ambiel */
  list(): UserTokenInfoType[];

  /**
   * Find by SUB
   * @param sub An identifier for the user, unique among all Google accounts
   * and never reused. A Google account can have multiple emails at different
   * points in time, but the sub value is never changed. Use sub within your
   * application as the unique-identifier key for the user.
   * @author Eric Ambiel
   */
  findBySub(sub: string): UserTokenInfoType;

  /** @author Eric Ambiel */
  save(userTokenInfo: UserTokenInfoType): void;

  /**
   * Delete by SUB
   * @param sub An identifier for the user, unique among all Google accounts
   * and never reused. A Google account can have multiple emails at different
   * points in time, but the sub value is never changed. Use sub within your
   * application as the unique-identifier key for the user.
   * @author Eric Ambiel
   */
  deleteBySub(sub: string): void;
}
