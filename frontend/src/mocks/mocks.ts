import { responseBookingOptions } from '../features/CreateMeeting/mocks/bookingOptions';
import {
  meetings,
  availableTimes,
} from '../features/CreateMeeting/mocks/calendar';
import { buildingsRoute } from '../services/building-service';
import { RoomT } from '../types/generaltypes';
import {
  get_bookedMeetingsRoute,
  bookingsRoute,
  get_scheduleAvailabilityRoute as get_scheduleAvailabilityRoute,
  post_getBookingOptionsRoute,
} from '../services/schedule-service';
import { adminUsersRoute, usersRoute } from '../services/user-service';
import { formatTimeIsoString, getRelevantMonday } from '../utils/dateHelpers';

import { buildings } from './buildings';
import { availableRooms, rooms } from './rooms';
import { userInfo, users, usersSimplified } from './users';
import dayjs from 'dayjs';
import { availableRoomsRoute } from '../services/room-service';

interface MockData {
  get: {
    [url: string]: any;
  };
  post: {
    [url: string]: any;
  };
  patch: {
    [url: string]: any;
  };
  delete: {
    [url: string]: any;
  };
  put: {
    [url: string]: any;
  };
}
const generateRoomRoutes = (): Record<string, RoomT[]> => {
  const roomRoutes: Record<string, RoomT[]> = {};
  rooms.forEach((room) => {
    const route = `room?building=${room.Building}`;
    if (!roomRoutes[route]) {
      roomRoutes[route] = [];
    }
    roomRoutes[route].push(room);
  });
  return roomRoutes;
};

const mockData: MockData = {
  get: {
    [`users`]: users,
    [`access`]: { message: 'Success', isAdmin: true },
    [`${buildingsRoute}`]: buildings, // problems using this in browser environment
    ...generateRoomRoutes(),
    [adminUsersRoute]: users,
    [`${usersRoute}?many=true`]: usersSimplified,
    [usersRoute]: userInfo,
    [get_bookedMeetingsRoute(
      formatTimeIsoString(getRelevantMonday(dayjs().format('YYYY-MM-DD')))
    )]: meetings,
    // [`${get_buildingsRoute}`]: buildings, // problems using this in browser environment
    // [`${import.meta.env.VITE_API_URL}building`]: buildings,
  },
  post: {
    [get_scheduleAvailabilityRoute]: availableTimes,
    [post_getBookingOptionsRoute]: responseBookingOptions,
    [`building`]: 'Successfully added building.',
    [`room`]: 'Successfully added room.',
    [`users`]: 'Successfully added user.',
    [bookingsRoute]: {
      error: '',
      info: 'Successfully added booking options.',
    },
    [availableRoomsRoute]: availableRooms,
  },
  patch: {},
  delete: {},
  put: {
    [`building/10`]: 'Successfully added building with id 10.',
    [`room/20`]: 'Successfully added room with id 20.',
    [`users/44`]: 'Successfully added user with id 44.',
  },
};

export default mockData;

// generates 6-digit random number
export function getRandomID(): number {
  return Math.floor(Math.random() * 900000 + 100000);
}
