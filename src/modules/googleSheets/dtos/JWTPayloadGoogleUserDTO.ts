export type JWTPayloadGoogleUserDTO = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
};
