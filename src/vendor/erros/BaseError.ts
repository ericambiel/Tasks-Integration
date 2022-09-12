type IError = Record<string, unknown>;

/**
 * Base error for the application, implements
 * the Error interface, so it can be type checked easily
 */
abstract class BaseError implements Error {
  public message: string;

  public name: string;

  public stack: string;

  public errors: IError[];

  protected constructor(errors: IError[]) {
    this.errors = errors;
  }

  getErrors(): IError[] {
    return this.errors;
  }

  setErrors(errors: IError[]): void {
    this.errors = errors;
  }

  appendToErrors(error: IError): void {
    this.errors.push(error);
  }
}

export { BaseError, IError };
