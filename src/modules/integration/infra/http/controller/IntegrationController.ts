import GoogleSheetToFluigWFService from '@modules/integration/services/GoogleSheetToFluigWFTService';
import { inject } from 'tsyringe';

export default class IntegrationController {
  constructor(
    @inject(GoogleSheetToFluigWFService)
    private googleSheetToFluigService: GoogleSheetToFluigWFService,
  ) {}

  createWorkflowFluig(): void {
    this.googleSheetToFluigService.execute();
  }
}
