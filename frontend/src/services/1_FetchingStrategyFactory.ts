import { AxiosRequestConfig } from 'axios';
import { getCognitoUserToken } from '../hooks/useLogin';
import { FetchingStrategy } from './3_FetchingStrategy';
import MockFetchingStrategy from './2_MockFetchingStrategy';

export type FetchingStrategyType = 'mock' | 'internal' | 'external';

export class FetchingStrategyFactory {
  createFetchingStrategy = (
    fetchingStrategyType: FetchingStrategyType,
    url?: string,
    config?: AxiosRequestConfig
  ): FetchingStrategy => {
    if (fetchingStrategyType === 'internal') {
      return this.createInternalFetchingStrategy(url, config);
    } else if (fetchingStrategyType === 'external') {
      return this.createExternalFetchingStrategy(url, config);
    } else {
      return this.createMockFetchingStrategy();
    }
  };

  private createInternalFetchingStrategy = (
    url?: string,
    config?: AxiosRequestConfig
  ) => {
    if (config) {
      config.headers = {
        ...config.headers,
        Authorization: getCognitoUserToken(),
      };
    } else {
      config = { headers: { Authorization: getCognitoUserToken() } };
    }
    return new FetchingStrategy({ url, config });
  };

  private createMockFetchingStrategy = () => {
    return new MockFetchingStrategy();
  };

  private createExternalFetchingStrategy = (
    url?: string,
    config?: AxiosRequestConfig
  ) => {
    return new FetchingStrategy({ url, config });
  };
}
