import { Credentials, TokenInfo } from 'google-auth-library';

/** @author Eric Ambiel */
export type UserTokenInfo = Credentials & {
  token_info: TokenInfo & { exp: string };
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
