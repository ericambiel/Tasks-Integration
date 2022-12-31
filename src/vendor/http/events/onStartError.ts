import ConsoleLog from '@libs/ConsoleLog';

/**
 * Set up an error listener and return it.
 *
 * @param {string|number} port
 * @return {(error: any) => void} onError
 */
export default function onError(port: string | number): (error: Error) => void {
  return (error: any) => {
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        ConsoleLog.print(
          `${bind} requires elevation of privileges!`,
          'error',
          'SERVER',
        );
        process.exit(1);
        break;
      case 'EADDRINUSE':
        ConsoleLog.print(`${bind} already in use!`, 'error', 'SERVER');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
}
