import {
  FetchingStrategyInterface,
  getFetchingStrategy,
} from './0_FetchingStrategy';
import { RoomT } from '../types/generaltypes';
import { get_roomByBuildingIdRoute } from '../routing/routes';
import { RoomAvailabilityT } from '../features/CreateMeeting/types/bookingOptions';

// Building GET - react query keys
export const adminRoomsRoute: string = 'admin/rooms';
export const availableRoomsRoute: string = 'availableRooms';

export class RoomService {
  private fetchingStrategy: FetchingStrategyInterface = getFetchingStrategy(
    'internal',
    import.meta.env.VITE_API_URL
  );

  public async get_roomsByBuildingId(buildingId: string): Promise<any> {
    return await this.fetchingStrategy.get(
      get_roomByBuildingIdRoute(buildingId)
    );
  }

  public async post_room(data: RoomT): Promise<any> {
    return await this.fetchingStrategy.post(adminRoomsRoute, data);
  }
  public async put_room(id: string, data: RoomT): Promise<any> {
    return await this.fetchingStrategy.put(`${adminRoomsRoute}?id=${id}`, data);
  }

  public async post_availableRooms(data: {
    buildingId: string;
    startTime: string;
    endTime: string;
  }): Promise<RoomAvailabilityT[]> {
    return await this.fetchingStrategy.post(availableRoomsRoute, data);
  }

  public async delete_room(data: RoomT): Promise<any> {
    return await this.fetchingStrategy.delete(
      `${adminRoomsRoute}?id=${data.id}`
    );
  }
}
