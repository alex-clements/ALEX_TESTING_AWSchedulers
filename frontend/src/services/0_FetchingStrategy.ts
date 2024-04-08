import { AxiosRequestConfig } from 'axios';
import {
  FetchingStrategyFactory,
  FetchingStrategyType,
} from './1_FetchingStrategyFactory';

export interface FetchingStrategyInterface {
  get(url: string, config?: any): Promise<any>;
  post(url: string, data: any, config?: any): Promise<any>;
  patch(url: string, data: any, config?: any): Promise<any>;
  delete(url: string, config?: any): Promise<any>;
  put(url: string, data: any, config?: any): Promise<any>;
}

export function getFetchingStrategy(
  strategyType: FetchingStrategyType,
  url?: string,
  config?: AxiosRequestConfig
): FetchingStrategyInterface {
  const fetchingStrategyFactory = new FetchingStrategyFactory();
  if (import.meta.env.VITE_NODE_ENV === 'test') {
    return fetchingStrategyFactory.createFetchingStrategy('mock');
  } else {
    return fetchingStrategyFactory.createFetchingStrategy(
      strategyType,
      url,
      config
    );
  }
}
