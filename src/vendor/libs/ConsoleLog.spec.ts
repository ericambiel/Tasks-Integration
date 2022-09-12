import ConsoleLog from './ConsoleLog';

describe('Teste Lib ConsoleLog', () => {
  // const consoleOutput: string[] = [];
  // const mockedConsole = (output: string) => consoleOutput.push(output);
  // beforeEach(() => ConsoleLog.print('TESTE JEST', 'info', 'test', true));
  const message = 'teste message';
  const type = 'info';
  const prefix = 'jest';
  const locale = 'en-US';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const now = ConsoleLog.getNow(locale);

  it('Should be format a message with time', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const returned = ConsoleLog.buildMessage(message, type, prefix, locale);

    expect(returned).toBe(
      `[${type.toUpperCase()}](${prefix.toUpperCase()}) ${now} - ${message}`,
    );
  });

  // it('Do not print on console if "API_SILENT_MODE" is active.', () => {
  //   ConsoleLog.print('TESTE JEST', 'info', 'test', true);

  //   expect(Console.).toEqual(['errorName', 'errorMessage']);
  // });
});
