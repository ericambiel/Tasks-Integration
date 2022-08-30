import { TaskFormDataDTO } from './TaskFormDataDTO';

export type WorkflowTaskDTO = {
  processInstanceId: 0;
  /**
   * Process ID
   * @example
   * Working hours recording (Apontamento Horas Trabalho) — '047'
   * Travel Request (Requisição de Viagem)                — '058'
   */
  processId: '047' | '058'; // Task Process ID is 047
  version: 5;
  /**
   * User Id - get from JWT TOKEN
   * @example
   * 'ambiele'
   */
  taskUserId: string;
  completeTask: true;
  currentMovto: 0;
  managerMode: false;
  selectedDestinyAfterAutomatic: -1;
  conditionAfterAutomatic: -1;
  selectedColleague: [];
  comments: '';
  newObservations: [];
  appointments: [];
  attachments: [];
  digitalSignature: false;
  formData: TaskFormDataDTO;
  isDigitalSigned: false;
  versionDoc: 0;
  selectedState: 12;
  internalFields: [];
  transferTaskAfterSelection: false;
  currentState: 1;
};