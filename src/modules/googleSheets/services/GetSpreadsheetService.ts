import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GetSpreadSheetValuesOption,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';

type GetSpreadsheetServiceOptions = {
  // clientId: GoogleClientCredential['web']['client_id'];
  // sub: string;
} & GetSpreadSheetValuesOption;

@injectable()
export default class GetSpreadsheetService {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    // @inject(GoogleUserRepository)
    // private googleUserRepository: IGoogleUserRepository,
    @inject(OAuth2Client)
    private oAuth2Client: OAuth2Client,
  ) {}

  execute(options: GetSpreadsheetServiceOptions) {
    // const userToken = this.googleUserRepository.findBySub(options.sub);

    // this.oAuth2Client.setCredentials(userToken);

    return this.googleAPI.getSpreadSheetValues(this.oAuth2Client, options);
  }
}
