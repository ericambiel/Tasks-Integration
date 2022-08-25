import { container, DependencyContainer, singleton } from 'tsyringe';
import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';

type OptionAxiosInstance = {
  instanceId: string;
  baseURL: string;
  Origin?: string;
};

@singleton()
export default class AxiosFacade {
  private axiosConfig: AxiosRequestConfig = {
    // set-cookies automatically to all requests(doesn't work)  https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    // // withCredentials: true,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    },
  };

  private readonly axiosContainer: DependencyContainer;

  constructor() {
    this.axiosContainer = container.createChildContainer();
  }

  axiosFactor(options: OptionAxiosInstance): Axios {
    const axiosInstance: AxiosInstance = axios.create({
      ...this.axiosConfig,
      baseURL: options.baseURL,
      headers: { Origin: options.Origin ?? false, ...this.axiosConfig.headers },
    });

    this.axiosContainer.registerInstance<Axios>(
      options.instanceId,
      axiosInstance,
    );

    return axiosInstance;
  }
}
