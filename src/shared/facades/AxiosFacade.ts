import { singleton } from 'tsyringe';
import axios, { Axios, AxiosInstance, AxiosRequestConfig } from 'axios';
import ContainerManagerHelper from '@helpers/ContainerManagerHelper';

type OptionAxiosInstance = {
  baseURL: string;
  Origin: string;
  instanceId?: string;
};

@singleton()
export default class AxiosFacade extends ContainerManagerHelper {
  private axiosConfig: AxiosRequestConfig = {
    // set-cookies automatically to all requests(doesn't work)  https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
    // withCredentials: true, // Doesn't work here, could be diferente call domain
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    },
  };

  constructor() {
    super();
  }

  axiosFactor(options: OptionAxiosInstance) {
    const axiosInstance: AxiosInstance = axios.create({
      ...this.axiosConfig,
      baseURL: options.baseURL,
      headers: { Origin: options.Origin ?? false, ...this.axiosConfig.headers },
    });

    if (options.instanceId)
      super.container.registerInstance<Axios>(
        options.instanceId,
        axiosInstance,
      );

    return axiosInstance;
  }
}
