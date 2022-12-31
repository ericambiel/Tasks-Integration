import { debuglog } from 'util';

export default class ConsoleLog {
  static print(
    err: string | Error,
    /** @default 'log' */
    type: 'error',
    prefix?: string,
    silent?: false,
    locale?: string,
  ): Error;

  static print(
    message: string,
    /** @default 'log' */
    type?: 'info' | 'warn' | 'debug',
    prefix?: string,
    silent?: boolean,
    locale?: string,
  ): void;

  /**
   * Static version of the printConsole method.
   *
   * @param message
   * @param {'info' | 'error' | 'warn' | 'debug' } [type] Defines how the message will appear in the console. Defaults “log”. P.S: To view debugs, environment variable ”NODE_DEBUG” must receive an array with descriptions informed in the 'prefix' parameter.
   * @param {string} [prefix] Will appear before the message, between square brackets [prefix], if not informed will appear [UNKNOWN].
   * @param {boolean} [silent] Useful for hiding messages in certain scenarios without removing the function call, eg, silent mode. It does not apply to “log” and “debug” type.
   * @param {string} [locale] Date and Time Location, e.g: br-PT, en-US... default: locale of the JavaScript runtime used.
   */
  static print(
    message: string | Error,
    /** @default 'log' */
    type?: 'info' | 'error' | 'warn' | 'debug',
    prefix?: string,
    silent?: boolean,
    locale?: string,
  ): void | Error {
    const formattedMessage = ConsoleLog.buildMessage(
      typeof message === 'string' ? message : message.message,
      type ?? 'log',
      prefix ?? 'UNKNOWN',
      locale,
    );

    if (typeof message !== 'string') {
      console.error(formattedMessage);
      if (!message.stack) return message;

      const columnName = `Stack of: ${prefix}, ERROR: ${message.name}`;

      const stack = message.stack.split('\n').map(err => err.trim());

      const enumerated = (array: unknown[]) => {
        let enu: any; // Record<string, Record<string, unknown>>;
        array.shift(); // Remove firt element, error name
        array.forEach((value, index) => {
          const rowNum = array.length - index;
          enu = { ...enu, [`step ${rowNum}`]: { [columnName]: value } };
        });
        return enu;
      };

      console.table(enumerated(stack));
      return message;
    }

    switch (true) {
      // Want print error, but it only a text.
      case type === 'error': {
        console.error(formattedMessage);
        return Error(message);
      }
      case type === 'info' && !silent: {
        return console.info(formattedMessage);
      }
      case type === 'warn' && !silent: {
        return console.warn(formattedMessage);
      }
      case type === 'debug' && !silent: {
        const debug = debuglog(prefix?.toUpperCase() ?? 'UNKNOWN');
        return debug(`${ConsoleLog.getNow(locale)} - ${message}`);
      }
      default:
        return console.log(`${ConsoleLog.getNow(locale)} - ${message}`);
    }
  }

  /**
   * Build a message, by composing its type with the datetime and the message itself.
   *
   * @private
   * @param {string} message The message to be print.
   * @param {string} type Type of message to be printed on the console.
   * @param {string} prefix A prefix to give context about the message.
   * @param {string} [locale] Date and Time Location, e.g: br-PT, en-US... default: locale of the JavaScript runtime used.
   * @returns {string} The composed message.
   */
  private static buildMessage(
    message: string,
    type: string,
    prefix: string,
    locale?: string,
  ): string {
    return `[${type.toUpperCase()}](${prefix.toUpperCase()}) ${ConsoleLog.getNow(
      locale,
    )} - ${message}`;
  }

  /**
   * Get current Date and Time in localized format.
   * @private
   * @param {string} [locale] Date and Time Location, e.g: br-PT, en-US... default: locale of the JavaScript runtime used.
   * @returns {string} Date and time in localized format.
   */
  private static getNow(locale?: string): string {
    return `${new Date().toLocaleDateString(
      locale,
    )} ${new Date().toLocaleTimeString(locale)}`;
  }
}
