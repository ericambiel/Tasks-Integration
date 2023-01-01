import { inject } from 'tsyringe';
import GetWorksheetService from '@modules/googleSheets/services/GetWorksheetService';
import IntegrationRepository from '@modules/integration/infra/local/repositories/IntegrationRepository';

export default class GetTaskFromGoogleSheetsService {
  constructor(
    @inject(GetWorksheetService)
    private getWorksheetService: GetWorksheetService,
    @inject(IntegrationRepository)
    private integrationRepository: IntegrationRepository,
  ) {}

  async execute() {
    // const connections = this.integrationRepository.list();
  }

  // TODO: Get task from sheet
}
