import { inject } from 'tsyringe';
import GetMinimumRequiredToWorkflowOMService from '@modules/fluig/services/GetMinimumRequiredToWorkflowOMService';

export default class IntegrationController {
  constructor(
    @inject(GetMinimumRequiredToWorkflowOMService)
    private service: GetMinimumRequiredToWorkflowOMService,
  ) {}

  createWorkflowFluig(): void {
    // this.googleSheetToFluigService.execute();
  }
}
