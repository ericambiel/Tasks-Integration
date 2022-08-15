import { Credentials, TokenInfo } from 'google-auth-library';

export type UserTokenInfo = Credentials & {
  tokenInfo: TokenInfo & { exp: string };
};

export interface IGoogleUserRepository {
  list(): UserTokenInfo[];

  /**
   * Find by SUb
   * @param sub An identifier for the user, unique among all Google accounts
   * and never reused. A Google account can have multiple emails at different
   * points in time, but the sub value is never changed. Use sub within your
   * application as the unique-identifier key for the user.
   */
  findBySub(sub: TokenInfo['sub']): UserTokenInfo | undefined;

  save(userTokenInfo: UserTokenInfo): void;

  delete(sub: TokenInfo['sub']): void;
}
