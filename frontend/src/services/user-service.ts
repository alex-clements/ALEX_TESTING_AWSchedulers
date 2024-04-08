import {
  FetchingStrategyInterface,
  getFetchingStrategy,
} from './0_FetchingStrategy';
import { UserInfoT, UserSimplifiedT, UserT } from '../types/generaltypes';

// Building GET - react query keys
export const adminUsersRoute: string = 'admin/users';
export const usersRoute: string = 'users';

export class UserService {
  private fetchingStrategy: FetchingStrategyInterface = getFetchingStrategy(
    'internal',
    import.meta.env.VITE_API_URL
  );

  public async get_users_admin(): Promise<any> {
    return await this.fetchingStrategy.get(adminUsersRoute);
  }

  public async get_users(): Promise<UserSimplifiedT[]> {
    return await this.fetchingStrategy.get(`${usersRoute}?many=true`);
  }

  public async get_user(): Promise<UserInfoT> {
    return await this.fetchingStrategy.get(usersRoute);
  }

  public async post_user(data: any): Promise<any> {
    return await this.fetchingStrategy.post(adminUsersRoute, data);
  }

  public async put_user(id: string, data: UserT): Promise<any> {
    return await this.fetchingStrategy.put(`${adminUsersRoute}?id=${id}`, data);
  }

  public async delete_user(data: UserT): Promise<any> {
    return await this.fetchingStrategy.delete(
      `${adminUsersRoute}?id=${data.id}`
    );
  }
}
