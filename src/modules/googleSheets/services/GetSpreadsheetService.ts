import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GetSpreadsheetValuesOption,
} from '@shared/facades/GoogleAPIFacade';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleClientRepository';
import { OAuth2Client } from 'google-auth-library';
import { extractPayloadFromJWT } from '@shared/helpers/smallHelper';
import { JWTPayloadGoogleUserDTO } from '@modules/googleSheets/dtos/JWTPayloadGoogleUserDTO';
import ConsoleLog from '@libs/ConsoleLog';

// TODO: Leave this to FACADE API
export interface ISheet<T> {
  metadata: GetSpreadsheetValuesOption & {
    userSub: JWTPayloadGoogleUserDTO['sub'];
  };
  sheetValues: T[];
}

@injectable()
export default class GetSpreadsheetService {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleClientRepository)
    private repository: IGoogleClientRepository,
  ) {}

  async execute(clientId: string, options: GetSpreadsheetValuesOption) {
    const token =
      this.googleAPI.container.resolve<OAuth2Client>(clientId).credentials
        .id_token;

    if (!token)
      throw ConsoleLog.print(
        "Can't get token, try set google Credentials again",
      );

    const tokenInfo = extractPayloadFromJWT<JWTPayloadGoogleUserDTO>(token);

    return <ISheet<Record<string, string | null>>>{
      metadata: { ...options, userSub: tokenInfo.sub },
      sheetValues: await this.googleAPI.getSpreadSheetValuesArrayObj(
        this.repository.findById(clientId),
        options,
      ),
    };
  }
}
