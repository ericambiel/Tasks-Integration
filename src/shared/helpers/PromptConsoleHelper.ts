import readline from 'readline';
import { singleton } from 'tsyringe';

@singleton()
export default class PromptConsoleHelper {
  async promptQuestion(question: string): Promise<string> {
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
