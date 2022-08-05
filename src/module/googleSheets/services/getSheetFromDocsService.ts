import { inject } from 'tsyringe';
import PromptConsoleHelper from '@shared/helpers/PromptConsoleHelper';
import GoogleSheetsFacade from '@shared/facades/GoogleSheetsFacade';
import Buffer from 'buffer';
import FilesHandlerHelper from '@shared/helpers/FilesHandlerHelper';

export default class GetSheetFromDocsService {
  constructor(
    @inject(GoogleSheetsFacade)
    private googleSheet: GoogleSheetsFacade,
    @inject(FilesHandlerHelper)
    private filesHandlerHelper: FilesHandlerHelper,
    @inject(PromptConsoleHelper)
    private promptConsoleHelper: PromptConsoleHelper,
  ) {}

  async execute() {
    // Load client secrets from a local file.
    const credentialsFileBuffer: Buffer = await this.filesHandlerHelper
      .readFile('credentials.json')
      .catch((e: Error) => {
        throw new Error(`Error loading client secret file: ${e}`);
      });

    // Authorize a client with credentials, then call the Google Sheets API.
    const authorization = await this.googleSheet.authorize(
      JSON.parse(credentialsFileBuffer.toString()),
    );

    // Get all values from Sheet
    this.googleSheet.getSpreadSheetValues(authorization);
  }
}
