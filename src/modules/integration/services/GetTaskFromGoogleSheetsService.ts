import { inject } from 'tsyringe';
import GetSpreadsheetService from '@modules/googleSheets/services/GetSpreadsheetService';
import IntegrationRepository from '@modules/integration/infra/local/repositories/IntegrationRepository';

export default class GetTaskFromGoogleSheetsService {
  constructor(
    @inject(GetSpreadsheetService)
    private getSpreadsheetService: GetSpreadsheetService,
    @inject(IntegrationRepository)
    private integrationRepository: IntegrationRepository,
  ) {}

  async execute() {
    // const connections = this.integrationRepository.list();
  }

  // TODO: Get task from sheet
}
