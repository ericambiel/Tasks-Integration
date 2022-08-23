import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GetSpreadSheetValuesOption,
  GoogleClientCredential,
} from '@shared/facades/GoogleAPIFacade';
import { OAuth2Client } from 'google-auth-library';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

type GetSpreadsheetServiceOptions = {
  clientId: GoogleClientCredential['web']['client_id'];
  sub: string;
} & GetSpreadSheetValuesOption;

@injectable()
export default class GetSpreadsheetService {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleUserRepository)
    private googleUserRepository: GoogleUserRepository,
    @inject(OAuth2Client)
    private oAuth2Client: OAuth2Client,
  ) {}

  execute(options: GetSpreadsheetServiceOptions) {
    const userToken = this.googleUserRepository.findBySub(options.sub);

    this.oAuth2Client.setCredentials(userToken);

    return this.googleAPI.getSpreadSheetValues(this.oAuth2Client, options);
  }
}
