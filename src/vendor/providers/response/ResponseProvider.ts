import { singleton } from 'tsyringe';
import { IError } from '../../erros/BaseError';

@singleton()
export default class ResponseProvider {
  public success: boolean;

  public data: Array<Record<string, unknown>> | Record<string, unknown>;

  public errors: IError[];

  public metadata: Record<string, unknown>;

  set(
    options: Pick<ResponseProvider, 'success' | 'data' | 'errors' | 'metadata'>,
  ): void {
    this.setSuccess(options.success)
      .setData(options.data)
      .setErrors(options.errors)
      .setMetadata(options.metadata);
  }

  setSuccess(success: boolean): this {
    this.success = success;
    return this;
  }

  setData(
    data: Array<Record<string, unknown>> | Record<string, unknown>,
  ): this {
    this.data = data;
    return this;
  }

  setErrors(errors: Record<string, unknown>[]): this {
    this.errors = errors;
    return this;
  }

  setMetadata(metadata: Record<string, unknown>): this {
    this.metadata = metadata;
    return this;
  }

  consume(): Pick<
    ResponseProvider,
    'success' | 'data' | 'errors' | 'metadata'
  > {
    return {
      success: this.success,
      data: this.data,
      errors: this.errors,
      metadata: this.metadata,
    };
  }
}
