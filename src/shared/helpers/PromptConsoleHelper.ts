import readline from 'readline';

export default class PromptConsoleHelper {
  static async promptQuestion(question: string): Promise<string> {
    return new Promise<string>(resolve => {
      const rLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rLine.question(question, answer => {
        rLine.close();
        resolve(answer);
      });
    });
  }
}
