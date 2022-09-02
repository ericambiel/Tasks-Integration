import { TokenInfo } from 'google-auth-library';
import { Exclude, Expose } from 'class-transformer';
import { JWTPayloadGoogleUserDTO } from '@modules/googleSheets/dtos/JWTPayloadGoogleUserDTO';

/*
  This interface is a merge between JWT Token and TokenInfo
 */
export interface IGoogleUserInformationModel {
  /**
   * An identifier for the user, unique among all Google accounts and never
   * reused. A Google account can have multiple emails at different points in
   * time, but the sub value is never changed. Use sub within your application
   * as the unique-identifier key for the user.
   * @example
   * '108866897033893388230'
   */
  sub: string;
  /**
   * Only if passed {TokenInfo} object
   * @example
   * 'my_email.@gmail.com'
   */
  email?: TokenInfo['email'];
  /**
   * Only if passed {JWTPayloadGoogleUse} object
   * @example
   * 'Eric Ambiel'
   */
  name?: JWTPayloadGoogleUserDTO['name'];
  /**
   * Only if passed {JWTPayloadGoogleUse} object
   * @example
   * 'https://lh3.googleusercontent.com/a-/AFdZuco7By6bUb19k6_XDSRkM0HZUuUT9A32FpbEU0RPNDY=s96-c'
   */
  picture?: JWTPayloadGoogleUserDTO['picture'];
  /**
   * Only if passed {JWTPayloadGoogleUse} object
   * @example
   * 'Eric'
   */
  given_name?: JWTPayloadGoogleUserDTO['given_name'];
  /**
   * Only if passed {JWTPayloadGoogleUse} object
   * @example
   * 'Ambiel'
   */
  family_name?: JWTPayloadGoogleUserDTO['family_name'];
  /**
   * Only if passed {JWTPayloadGoogleUse} object
   * @example
   * 'pt-BR'
   */
  locale?: JWTPayloadGoogleUserDTO['locale'];
}

@Exclude()
export default class GoogleUserInformationModel
  implements IGoogleUserInformationModel
{
  @Expose()
  sub: string;

  @Expose()
  email?: TokenInfo['email'];

  @Expose()
  name?: JWTPayloadGoogleUserDTO['name'];

  @Expose()
  picture?: JWTPayloadGoogleUserDTO['picture'];

  @Expose()
  given_name?: JWTPayloadGoogleUserDTO['given_name'];

  @Expose()
  family_name?: JWTPayloadGoogleUserDTO['family_name'];

  @Expose()
  locale?: JWTPayloadGoogleUserDTO['locale'];
}
