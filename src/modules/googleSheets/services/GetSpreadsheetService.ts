import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GetSpreadsheetValuesOption,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';

@injectable()
export default class GetSpreadsheetService {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(OAuth2Client)
    private oAuth2Client: OAuth2Client,
  ) {}

  execute(options: GetSpreadsheetValuesOption) {
    return this.googleAPI.getSpreadSheetValuesArrayObj(
      this.oAuth2Client,
      options,
    );
  }
}
