import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GDriveMINEEnum,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import GoogleUserRepository from '@modules/googleSheets/infra/local/repositories/GoogleUserRepository';

@injectable()
export default class {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleUserRepository)
    private oAuth2Client: OAuth2Client,
  ) {}

  execute(spreadsheetName: string) {
    return this.googleAPI.findFilesDrive(this.oAuth2Client, {
      mimeType: GDriveMINEEnum.spreadsheet,
      name: spreadsheetName,
    });
  }
}
