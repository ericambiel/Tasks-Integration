import { debuglog } from 'util';

export default class ConsoleLog {
  static print(
    message: string,
    /** @default 'log' */
    type?: 'error',
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
   * @param {'info' | 'error' | 'warn' | 'debug' } [type] Defines how the message will appear in the console. Defaults is "log". P.S: To view debugs, environment variable "NODE_DEBUG" must receive an array with descriptions informed in the 'prefix' parameter.
   * @param {string} [prefix] Will appear before the message, between square brackets [prefix], if not informed will appear [UNKNOWN].
   * @param {boolean} [silent] Useful for hiding messages in certain scenarios without removing the function call, eg, silent mode. It does not apply to "log" and "debug" type.
   * @param {string} [locale] Date and Time Location, e.g: br-PT, en-US... default: locale of the JavaScript runtime is used.
   */
  static print(
    message: string,
    /** @default 'log' */
    type?: 'info' | 'error' | 'warn' | 'debug',
    prefix?: string,
    silent?: boolean,
    locale?: string,
  ): void | Error {
    const formattedMessage = ConsoleLog.buildMessage(
      message,
      type ?? 'log',
      prefix ?? 'UNKNOWN',
      locale,
    );
    if (type !== 'error')
      switch (true) {
        case type === 'info' && !silent: {
          console.info(formattedMessage);
          break;
        }
        case type === 'warn' && !silent: {
          console.warn(formattedMessage);
          break;
        }
        case type === 'debug' && !silent: {
          const debug = debuglog(prefix?.toUpperCase() ?? 'UNKNOWN');
          debug(`${ConsoleLog.getNow(locale)} - ${message}`);
          break;
        }
        default:
          console.log(`${ConsoleLog.getNow(locale)} - ${message}`);
      }
    console.error(formattedMessage);
    return Error(formattedMessage);
  }

  /**
   * Build a message, by composing its type with the datetime and the message itself.
   *
   * @private
   * @param {string} message The message to be print.
   * @param {string} type Type of message to be printed on the console.
   * @param {string} prefix A prefix to give context about the message.
   * @param {string} [locale] Date and Time Location, e.g: br-PT, en-US... default: locale of the JavaScript runtime is used.
   * @returns {string} The composed message
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
   * @param {string} [locale] Date and Time Location, e.g: br-PT, en-US... default: locale of the JavaScript runtime is used.
   * @returns {string} Date and time in localized format.
   */
  private static getNow(locale?: string): string {
    return `${new Date().toLocaleDateString(
      locale,
    )} ${new Date().toLocaleTimeString(locale)}`;
  }
}
