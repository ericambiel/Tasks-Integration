import { Credentials } from 'google-auth-library';
import GoogleUserInformationModel from '@modules/googleSheets/infra/local/models/GoogleUserInformationModel';

/** @author Eric Ambiel */
export type UserTokenInfo = Credentials & {
  user_information: GoogleUserInformationModel;
};

/** @author Eric Ambiel */
export interface IGoogleUserRepository {
  /** @author Eric Ambiel */
  list(): UserTokenInfo[];

  /**
   * Find by SUB
   * @param sub An identifier for the user, unique among all Google accounts
   * and never reused. A Google account can have multiple emails at different
   * points in time, but the sub value is never changed. Use sub within your
   * application as the unique-identifier key for the user.
   * @author Eric Ambiel
   */
  findBySub(sub: string): UserTokenInfo;

  /** @author Eric Ambiel */
  save(userTokenInfo: UserTokenInfo): void;

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
