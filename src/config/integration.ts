export default (): {
  /** @default 'Apontamento Horas' */
  INTEGRATION_TASK_SPREADSHEET: string;
} => {
  return {
    INTEGRATION_TASK_SPREADSHEET:
      process.env.INTEGRATION_TASK_SPREADSHEET ?? 'Apontamento Horas',
  };
};
