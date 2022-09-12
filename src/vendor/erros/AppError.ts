import { BaseError, IError } from './BaseError';

export interface ICommonErrors {
  NOT_FOUND: IError;
}

export default class AppError extends BaseError {
  public static readonly commons: ICommonErrors = {
    NOT_FOUND: {
      entity: "The Entity doesn't exist",
    },
  };

  constructor(errors: IError[]) {
    super(errors);
  }
}
