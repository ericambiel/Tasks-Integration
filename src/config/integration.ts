export default (): {
  /** @default 'Apontamento Horas' */
  TASK_SPREADSHEET: string;
} => {
  return {
    TASK_SPREADSHEET:
      process.env.INTEGRATION_TASK_SPREADSHEET ?? 'Apontamento Horas',
  };
};
