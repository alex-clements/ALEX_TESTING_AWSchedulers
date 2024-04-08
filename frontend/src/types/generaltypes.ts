export type UserT = {
  id: string;
  username?: string;
  temporaryPassword?: string;
  name: string;
  email?: string;
  Building: string;
  floorNumber: number;
  isAdmin?: boolean;
  isActive: boolean;
};

export type UserInfoT = {
  username: string;
  name: string;
  email: string;
  floorNumber: number;
  Building: {
    airportCode: string;
    number: number;
    location: string;
  };
};

export type UserSimplifiedT = {
  id: string;
  name: string;
  email?: string;
};

export type BuildingT = {
  id: string;
  number: number;
  name: string;
  airportCode: string;
  location: string;
  latitude: number;
  longitude: number;
  maxFloor: number;
  isActive: boolean;
  activateAllRooms?: boolean;
};

export type RoomT = {
  id: string;
  roomName?: string;
  roomNumber: string;
  Building: string;
  floorNumber: number;
  capacity: number;
  AV: boolean;
  VC: boolean;
  isActive: boolean;
};

// needs fine-tuning
export type MeetingT = {
  id: number;
  organizerID: number;
  participantIDs: any;
  startTime: number;
  endTime: number;
  multiRoom: boolean;
  audio: boolean;
  video: boolean;
};

export const addingItemID: string = '-1';
