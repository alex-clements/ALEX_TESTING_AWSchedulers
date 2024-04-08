// HTTP Post REQUEST - Asking for Booking Options
export type AddBookingRequestT = {
  name: string;
  startTime: string;
  endTime: string;
  roomUser: [{ id: string; userId: string[] }];
  startDay: string;
};

// HTTP Post REQUEST - Asking for Booking Options
export type GetScheduleAvailabilityRequestT = {
  users: Array<string>; //ids
  startDay: string;
  currentDay: string;
};

// HTTP Post REQUEST - To Book a Meeting
export interface BookMeetingRequestT {
  name: string;
  startTime: string;
  endTime: string;
  organizer: string;
  roomUser: RoomUser[];
}

interface RoomUser {
  id: string;
  users: string[];
}
// HTTP Post REQUEST - Asking for Booking Options
export type BookingOptionsRequestT = {
  users: Array<string>;
  AV: boolean;
  VC: boolean;
  singleRoom: boolean;
  startTime: string;
  endTime: string;
  replaceMeeting: boolean;
};
// HTTP Delete REQUEST - Delete Booked Meeting
export type DeleteBookedMeetingRequestT = {
  id: string;
  username: string;
};

// HTTP Post RESPONSE - Data returned from Algo
export type BookingOptionsResponseT = {
  recommendations: RecommendationT[];
  participants: AttendeeT[];
};

export type UserDistance = {
  user: AttendeeT;
  distance: number;
};

export type RecommendationT = {
  recommendationId: number;
  rooms: RoomBookingT[];
  distances?: UserDistance[];
  totalDistance?: number;
};

export type RoomBookingT = {
  airportCode: string;
  buildingNumber: number;
  id: string;
  roomName: string;
  roomNumber: string;
  floorNumber: number;
  capacity: number;
  AV: boolean;
  VC: boolean;
  attendees: AttendeeT[]; // !!!!! Make sure to include attendees
};
// Attendee Type
export type AttendeeT = {
  id: string;
  name: string;
};
export type BuildingOptionT = {
  airportCode: string;
  buildingNumber: number;
  rooms: RoomT[];
};
export type RoomT = {
  id: string;
  roomName: string;
  roomNumber: string;
  floorNumber: number;
  capacity: number;
  AV: boolean;
  VC: boolean;
};

export type RoomAvailabilityT = RoomT & {
  available: boolean;
};
