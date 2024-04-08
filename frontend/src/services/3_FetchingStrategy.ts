import { act } from 'react-dom/test-utils';
import { FetchingStrategyInterface } from './0_FetchingStrategy';
import axios, { AxiosRequestConfig } from 'axios';
import { getCognitoUserToken } from '../hooks/useLogin';

interface IFetchingStrategy {
  url?: string;
  config?: AxiosRequestConfig;
}

export class FetchingStrategy implements FetchingStrategyInterface {
  private url: string = '';
  private config: AxiosRequestConfig = {};

  constructor(params?: IFetchingStrategy) {
    if (params) {
      const { url, config } = params;
      this.url = url || '';
      this.config = config || {};
    }
  }

  // prettier-ignore
  async get(api: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    const actualConfig= config || this.config
    actualConfig.params = data
    if(!actualConfig.headers) {
      actualConfig.headers = {}
    }else {
      actualConfig.headers.Authorization = getCognitoUserToken()
    }
    const results = await axios.get(this.url + api, actualConfig);
    return results?.data?.result;
  }

  // prettier-ignore
  async post(api: string,data: any,config?: AxiosRequestConfig): Promise<any> {
    const results = await axios.post(
      this.url + api,
      data,
      config || this.config
    );
    return results?.data?.result;
    // return results;
  }

  // prettier-ignore
  async patch(api: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    const results = await axios.patch(
      this.url + api,
      data,
      config || this.config
    );
    return results?.data;
  }

  async delete(api: string, config?: AxiosRequestConfig): Promise<any> {
    const results = await axios.delete(this.url + api, config || this.config);
    return results?.data;
  }

  async put(api: string, data: any, config?: AxiosRequestConfig): Promise<any> {
    const results = await axios.put(
      this.url + api,
      data,
      config || this.config
    );
    return results?.data;
  }
}
