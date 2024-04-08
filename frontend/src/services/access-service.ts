import {
  FetchingStrategyInterface,
  getFetchingStrategy,
} from './0_FetchingStrategy';

export const get_accessRoute: string = 'access';

interface GetAccessData {
  status: string;
  isAdmin: boolean;
}

export class AccessService {
  private fetchingStrategy: FetchingStrategyInterface = getFetchingStrategy(
    'internal',
    import.meta.env.VITE_API_URL
  );

  public async get_access(): Promise<GetAccessData> {
    return await this.fetchingStrategy.get(`${get_accessRoute}`);
  }
}
