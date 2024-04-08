import { UserSimplifiedT } from '../../../types/generaltypes';

export type BookedMeetingT = {
  bookingId: string;
  startTime: string;
  endTime: string;
  name: string;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  isOrganizer: boolean;
  room: {
    id: string;
    name: string;
    number: string;
    floorNumber: number;
    isActive: boolean;
  };
  building: {
    airportCode: string;
    number: number;
    location: string;
  };
  attendees: UserSimplifiedT[];
};

export type AvailableTimeT = {
  startTime: string;
  endTime: string;
};

export type TimeAvailableHashT = {
  [startTime: string]: boolean; // Each time slot is a key with a boolean value
};

export type DayAvailableHashT = {
  [day: string]: TimeAvailableHashT; // Each day maps to a hash map of time slots
};
