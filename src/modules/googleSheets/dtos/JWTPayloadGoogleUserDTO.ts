import { JWTPayloadClaims } from '@shared/helpers/smallHelper';

export type JWTPayloadGoogleUserDTO = JWTPayloadClaims & {
  azp: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
};
