export default (): {
  /** @default 'Apontamento Horas' */
  TASK_WORKBOOK: string;
  /** @default 'Horas!A2:H' */
  TASK_RANGE_WORKSHEET: string;
  /** @default 'Configurações!F2:H3' */
  CONF_RANGE_WORKSHEET: string;
} => {
  return {
    TASK_WORKBOOK: process.env.INTEGRATION_TASK_WORKBOOK ?? 'Apontamento Horas',
    TASK_RANGE_WORKSHEET:
      process.env.INTEGRATION_TASK_RANGE_WORKSHEET ?? 'Horas!A2:H',
    CONF_RANGE_WORKSHEET:
      process.env.INTEGRATION_CONF_RANGE_WORKSHEET ?? 'Configurações!F2:H3',
  };
};
