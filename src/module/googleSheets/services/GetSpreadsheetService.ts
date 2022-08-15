import { inject } from 'tsyringe';
import GoogleServicesFacade, {
  GetSpreadSheetValuesOption,
  GoogleClientCredential,
} from '@shared/facades/GoogleServicesFacade';
import { TokenInfo } from 'google-auth-library';
import GoogleClientRepository from '../infra/local/repositories/GoogleClientRepository';
import GoogleUserRepository from '../infra/local/repositories/GoogleUserRepository';

type GetSpreadsheetServiceOptions = {
  clienteId: GoogleClientCredential['web']['client_id'];
  sub: TokenInfo['sub'];
} & GetSpreadSheetValuesOption;

export default class GetSpreadsheetService {
  constructor(
    @inject(GoogleServicesFacade)
    private googleSheet: GoogleServicesFacade,
    @inject(GoogleClientRepository)
    private googleClientRepository: GoogleClientRepository,
    @inject(GoogleUserRepository)
    private googleUserRepository: GoogleUserRepository,
  ) {}

  execute(options: GetSpreadsheetServiceOptions) {
    const userToken = this.googleUserRepository.findBySub(options.sub);
    const oAuth2Client = this.googleClientRepository.findById(
      options.clienteId,
    );

    if (!userToken)
      throw new Error(`We can't find a Google user informed: ${options.sub}`);

    oAuth2Client.setCredentials(userToken);

    return this.googleSheet.getSpreadSheetValues(oAuth2Client, options); // Stopped here, need to test
  }
}
