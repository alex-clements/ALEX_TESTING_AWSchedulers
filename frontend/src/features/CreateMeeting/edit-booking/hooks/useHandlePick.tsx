import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import { RoomAvailabilityT, AttendeeT } from '../../types/bookingOptions';
import { useCreateMeeting } from '../../context/useCreateMeetingContext';
import { BuildingT } from '../../../../types/generaltypes';
import { SelectChangeEvent } from '@mui/material';

/**
 * Custom hook for handling the picking of buildings, rooms, and users in the booking form.
 *
 * @param buildings - An array of buildings.
 * @param rooms - An array of room availabilities.
 * @param pickedUsers - An array of picked users.
 * @param setPickedUsers - A function to set the picked users.
 * @param setPickedBuilding - A function to set the picked building.
 * @param setPickedRoom - A function to set the picked room.
 * @param pickedRoom - The currently picked room.
 * @returns An object containing the picked user alerts and change handlers for building, room, and users.
 */
export default function useHandlePick(
  buildings: BuildingT[],
  rooms: RoomAvailabilityT[],
  pickedUsers: AttendeeT[],
  setPickedUsers: Dispatch<SetStateAction<AttendeeT[]>>,
  setPickedBuilding: Dispatch<SetStateAction<BuildingT | undefined>>,
  setPickedRoom: Dispatch<SetStateAction<RoomAvailabilityT | null | undefined>>,
  pickedRoom?: RoomAvailabilityT | null
) {
  const [pickedUserAlerts, setPickedUserAlerts] = useState<string>('');
  const { participants } = useCreateMeeting();

  useEffect(() => {
    setPickedUserAlerts('');
    if (pickedRoom?.capacity && pickedUsers.length > pickedRoom.capacity) {
      const newAttendees = pickedUsers.slice(0, pickedRoom.capacity);
      const removedAttendees = pickedUsers
        .slice(pickedRoom.capacity)
        .map((user) => user.name)
        .join(', ');
      setPickedUsers(newAttendees);
      setPickedUsers((prev) => prev.slice(0, pickedRoom.capacity));
      setPickedUserAlerts(
        'Room capacity exceeded removed: ' + removedAttendees
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedRoom?.capacity, setPickedUsers]);

  const handleChangeBuilding = useCallback(
    (event: SelectChangeEvent<string>) => {
      if (event.target.value) {
        setPickedBuilding(
          buildings.find((building) => building.id === event.target.value)
        );
        setPickedRoom(null);
      }
    },
    [buildings, setPickedBuilding, setPickedRoom]
  );

  const handleChangeRoom = useCallback(
    (event: SelectChangeEvent<string>) => {
      if (event.target.value) {
        const room = rooms.find((room) => room.id === event.target.value);
        setPickedRoom(room);
      }
    },
    [rooms, setPickedRoom]
  );

  const handleChangeUsers = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      if (!pickedRoom?.capacity) return;
      setPickedUserAlerts('');
      const roomUsers = participants.filter((participant) =>
        event?.target.value.includes(participant.id)
      );
      if (roomUsers.length > pickedRoom.capacity) {
        setPickedUserAlerts('Room capacity exceeded can not add more users');
        return;
      }
      setPickedUsers(roomUsers);
    },
    [participants, setPickedUsers, setPickedUserAlerts, pickedRoom?.capacity]
  );

  return {
    pickedUserAlerts,
    handleChangeBuilding,
    handleChangeRoom,
    handleChangeUsers,
  };
}
