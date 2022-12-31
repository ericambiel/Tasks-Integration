import * as http from 'http';
import ConsoleLog from '@libs/ConsoleLog';
import { api } from '@configs/*';

const apiConfig = api();

export default function onStarted(server: http.Server): () => void {
  return () => {
    const bind =
      typeof server.address() === 'string'
        ? `pipe: ${server.address()}`
        : `address: ${JSON.stringify(server.address())}`;
    ConsoleLog.print(
      `API is running on ${bind}`,
      'info',
      'SERVER',
      apiConfig.SILENT_MODE,
    );
  };
}
