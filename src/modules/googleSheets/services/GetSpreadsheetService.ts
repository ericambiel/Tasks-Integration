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

  // execute({
  //   spreadsheetId,
  //   range,
  // }: GetSpreadsheetValuesOption): Promise<Record<string, string | null>[]>;
  //
  // execute(options: GetSpreadsheetValuesOption): Promise<string[][]>;

  execute(
    options: GetSpreadsheetValuesOption,
  ): Promise<string[][] | Record<string, string | null>[]> {
    return this.googleAPI.getSpreadSheetValues(this.oAuth2Client, options);
  }
}
