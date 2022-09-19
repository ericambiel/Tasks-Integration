import { singleton } from 'tsyringe';
import { IError } from '../../erros/BaseError';

export type ResponseProviderProps = {
  success: boolean;
  data: Array<Record<string, unknown>> | Record<string, unknown>;
  errors: IError[];
  metadata: Record<string, unknown>;
};

@singleton()
export default class ResponseProvider {
  constructor(private props: ResponseProviderProps) {}

  // set(options: IResponseProvider): void {
  //   this.setSuccess(options.success)
  //     .setData(options.data)
  //     .setErrors(options.errors)
  //     .setMetadata(options.metadata);
  // }

  get metadata() {
    return this.props.metadata;
  }

  setSuccess(success: typeof this.props.success) {
    this.props.success = success;
    return this;
  }

  setData(data: typeof this.props.data) {
    this.props.data = data;
    return this;
  }

  setErrors(errors: typeof this.props.errors) {
    this.props.errors = errors;
    return this;
  }

  setMetadata(metadata: typeof this.props.metadata) {
    this.props.metadata = metadata;
    return this;
  }

  getProps(): ResponseProviderProps {
    return {
      success: this.props.success,
      data: this.props.data,
      errors: this.props.errors,
      metadata: this.props.metadata,
    };
  }
}
