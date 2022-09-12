import { IError } from '../../erros/BaseError';

export abstract class ResponseProviderBase {
  protected success: boolean;

  protected data: Array<Record<string, unknown>> | Record<string, unknown>;

  protected errors: IError[];

  protected metadata: Record<string, unknown>;
}

export interface IResponseProvider {
  set(options: ResponseProviderBase): void;

  setSuccess(success: boolean): this;

  setData(data: Array<Record<string, unknown>> | Record<string, unknown>): this;

  setErrors(errors: Record<string, unknown>[]): this;

  setMetadata(metadata: Record<string, unknown>): this;

  consume(): ResponseProviderBase;

  reset(): void;
}
