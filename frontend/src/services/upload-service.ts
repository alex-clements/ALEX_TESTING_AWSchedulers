import {
  FetchingStrategyInterface,
  getFetchingStrategy,
} from './0_FetchingStrategy';

export const upload_route: string = 'admin/upload';

export class UploadService {
  private fetchingStrategy: FetchingStrategyInterface = getFetchingStrategy(
    'internal',
    import.meta.env.VITE_API_URL
  );
  public async post_users(data: string): Promise<any> {
    return await this.fetchingStrategy.post(`${upload_route}`, data);
  }
}
