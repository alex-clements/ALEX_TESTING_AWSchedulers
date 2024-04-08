import {
  FetchingStrategyInterface,
  getFetchingStrategy,
} from './0_FetchingStrategy';
import {
  BookingOptionsRequestT,
  BookMeetingRequestT,
  GetScheduleAvailabilityRequestT,
} from '../features/CreateMeeting/types/bookingOptions';

// Building GET - react query keys
export const usersRoute = `users`;
export const get_bookedMeetingsRoute = (startDay: string) =>
  `user/schedule?startDay=${startDay}`;
export const get_scheduleAvailabilityRoute = 'user/attendeesAvailability';
export const post_getBookingOptionsRoute = `user/bookingOptions`;
export const bookingsRoute = `user/bookings`;

export class ScheduleService {
  private fetchingStrategy: FetchingStrategyInterface = getFetchingStrategy(
    'internal',
    import.meta.env.VITE_API_URL
  );

  public async get_bookedMeetings(startDay: string): Promise<any> {
    return await this.fetchingStrategy.get(get_bookedMeetingsRoute(startDay));
  }
  // prettier-ignore
  public async get_scheduleAvailability(data: GetScheduleAvailabilityRequestT): Promise<any> {
    if (data.users.length === 0) data.users = [];
    return await this.fetchingStrategy.post(get_scheduleAvailabilityRoute, data);
  }
  // prettier-ignore
  public async post_getBookingOptions(requestBookingOptions: BookingOptionsRequestT): Promise<any> {
    return await this.fetchingStrategy.post(post_getBookingOptionsRoute, requestBookingOptions);
  }
  // prettier-ignore
  public async post_bookMeeting(data : BookMeetingRequestT): Promise<any> {
    return await this.fetchingStrategy.post(bookingsRoute, data);
  }

  // prettier-ignore
  public async delete_bookedMeeting(id : string): Promise<any> {
    return await this.fetchingStrategy.delete(`${bookingsRoute}?id=${id}`);
  }
}
