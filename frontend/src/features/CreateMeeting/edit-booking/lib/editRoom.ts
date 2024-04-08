import { CreateMeetingState } from '../../context/useCreateMeetingContext';
import { AttendeeT, RoomBookingT, RoomT } from '../../types/bookingOptions';
import { BuildingT } from '../../../../types/generaltypes';

export function updateRooms(
  prevMeetingState: CreateMeetingState,
  building: BuildingT,
  room: RoomT,
  attendees: AttendeeT[],
  recommendedRoom?: RoomBookingT
): CreateMeetingState {
  let { bookingInformation } = prevMeetingState;

  // Should always be defined at this stage
  if (!bookingInformation) {
    bookingInformation = {
      rooms: [],
      recommendationId: -1,
    };
  }

  const { rooms, recommendationId } = bookingInformation;

  // Removes the edit room if exists
  let newRooms: RoomBookingT[] = rooms.filter(
    (prevRoom) => prevRoom.id !== recommendedRoom?.id && prevRoom.id !== room.id
  );

  const newRoom: RoomBookingT = {
    ...room,
    attendees,
    airportCode: building.airportCode,
    buildingNumber: building.number,
  };

  const newRoomAttendeesIds = attendees.map((attendee) => attendee.id);

  // Removes attendees from other rooms if select for this room
  newRooms = newRooms.map((room) => {
    const attendees = room.attendees.filter(
      (attendee) => !newRoomAttendeesIds.includes(attendee.id)
    );
    return { ...room, attendees };
  });

  newRooms = newRooms.filter((rooms) => !!rooms.attendees.length);

  newRooms.push(newRoom);

  return {
    ...prevMeetingState,
    bookingInformation: {
      recommendationId,
      rooms: newRooms,
    },
  };
}

export function removeRoom(
  prevMeetingState: CreateMeetingState,
  roomToRemoveId: string
): CreateMeetingState {
  const { bookingInformation } = prevMeetingState;

  if (!bookingInformation) return prevMeetingState;

  const { rooms, recommendationId } = bookingInformation;

  const newRooms = rooms.filter((room) => room.id !== roomToRemoveId);

  return {
    ...prevMeetingState,
    bookingInformation: {
      recommendationId,
      rooms: newRooms,
    },
  };
}
