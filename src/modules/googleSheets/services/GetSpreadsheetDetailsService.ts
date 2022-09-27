import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GDriveMINEEnum,
} from '@shared/facades/GoogleAPIFacade';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleClientRepository';

@injectable()
export default class {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleClientRepository)
    private repository: IGoogleClientRepository,
  ) {}

  execute(clientId: string, spreadsheetName: string) {
    const oAuth2Client = this.repository.findById(clientId);

    return this.googleAPI.findFilesDrive(oAuth2Client, {
      mimeType: GDriveMINEEnum.spreadsheet,
      name: spreadsheetName,
    });
  }
}
