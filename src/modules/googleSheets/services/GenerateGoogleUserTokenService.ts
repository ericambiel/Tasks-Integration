import { inject, singleton } from 'tsyringe';
import GoogleAPIFacade from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import { IGoogleUserRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleUserRepository';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';
import { JWTPayloadGoogleUserDTO } from '@modules/googleSheets/dtos/JWTPayloadGoogleUserDTO';
import { plainToInstance } from 'class-transformer';
import GoogleUserInformationModel from '@modules/googleSheets/infra/local/models/GoogleUserInformationModel';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

type GenerateGoogleUserTokenServiceOption = {
  /**
   * A code validation for a new token.
   */
  validationTokenCode: string;
};

@singleton()
export default class GenerateGoogleUserTokenService {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleUserRepository)
    private repository: IGoogleUserRepository,
    @inject(OAuth2Client)
    private oAuth2Client: OAuth2Client,
  ) {}

  async execute(options: GenerateGoogleUserTokenServiceOption): Promise<void> {
    const { validationTokenCode } = options;

    const newTokenUser = await this.googleAPI.getNewToken(
      this.oAuth2Client,
      validationTokenCode,
    );

    if (!newTokenUser.access_token)
      throw new Error(
        `Something wrong with the new token obtained, property "access_token" doesn't exists`,
      );

    // Get more information from user giving a token,
    // use this if id_token isn't Bearer Token
    // const tokenInfo = await this.googleAPI.getTokenInformation(
    //   this.oAuth2Client,
    //   newTokenUser.access_token,
    // );

    if (!newTokenUser.id_token)
      throw new Error(
        `Something wrong with the new token obtained, property "id_token" doesn't exists`,
      );

    const tokenInfo = extractPayloadFromJWT<JWTPayloadGoogleUserDTO>(
      newTokenUser.id_token,
    );

    const userInformation = plainToInstance(
      GoogleUserInformationModel,
      tokenInfo,
    );

    // Save token on disc
    this.repository.save({
      ...newTokenUser,
      user_information: userInformation,
    });
  }
}
