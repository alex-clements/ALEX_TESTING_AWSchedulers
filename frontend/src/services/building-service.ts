import {
  FetchingStrategyInterface,
  getFetchingStrategy,
} from './0_FetchingStrategy';
import { BuildingT } from '../types/generaltypes';

// Building GET - react query keys
export const buildingsAdminRoute: string = 'admin/buildings';
export const buildingsRoute: string = 'buildings';

export class BuildingService {
  private fetchingStrategy: FetchingStrategyInterface = getFetchingStrategy(
    'internal',
    import.meta.env.VITE_API_URL
  );

  public async get_buildings(): Promise<any> {
    return await this.fetchingStrategy.get(buildingsRoute);
  }
  // Wont need this query yet

  // public async get_buildingById(id: string): Promise<any> {
  //   return await this.get(
  //     import.meta.env.VITE_API_URL + get_buildingByIdRoute(id)
  //   );
  // }

  public async post_building(data: BuildingT): Promise<any> {
    return await this.fetchingStrategy.post(buildingsAdminRoute, data);
  }

  public async put_building(id: string, data: BuildingT): Promise<any> {
    return await this.fetchingStrategy.put(
      `${buildingsAdminRoute}?id=${id}`,
      data
    );
  }

  public async delete_building(data: BuildingT): Promise<any> {
    return await this.fetchingStrategy.delete(
      `${buildingsAdminRoute}?id${data.id}`
    );
  }
}
