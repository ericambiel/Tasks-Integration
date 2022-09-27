import { inject, injectable } from 'tsyringe';
import GoogleAPIFacade, {
  GetSpreadsheetValuesOption,
} from '@shared/facades/GoogleAPIFacade';
import GoogleClientRepository from '@modules/googleSheets/infra/local/repositories/GoogleClientRepository';
import { IGoogleClientRepository } from '@modules/googleSheets/infra/local/repositories/IGoogleClientRepository';

@injectable()
export default class GetSpreadsheetService {
  constructor(
    @inject(GoogleAPIFacade)
    private googleAPI: GoogleAPIFacade,
    @inject(GoogleClientRepository)
    private repository: IGoogleClientRepository,
  ) {}

  execute(clientId: string, options: GetSpreadsheetValuesOption) {
    return this.googleAPI.getSpreadSheetValuesArrayObj(
      this.repository.findById(clientId),
      options,
    );
  }
}
