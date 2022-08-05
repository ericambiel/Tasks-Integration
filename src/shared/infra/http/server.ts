import 'reflect-metadata';
import { resolve } from 'path';
import dotEnvSafe from 'dotenv-safe';
import routes from '@shared/infra/http/routes';
// import { ConsoleLog } from 'ekaizen-framework/libs';
// import { createServer } from 'ekaizen-framework/vendor';

ConsoleLog.print('Starting server...', 'info', 'SERVER');

dotEnvSafe.config({
  path: resolve(__dirname, '..', '..', '..', '..', '.env'),
  allowEmptyValues: true,
});

createServer(routes)
.then(() => {
  ConsoleLog.print('Server started.', 'info', 'SERVER');
  serverController.startServer().then();
})
.catch(error => {
  ConsoleLog.print(error.toString(), 'error', 'SERVER');
});
