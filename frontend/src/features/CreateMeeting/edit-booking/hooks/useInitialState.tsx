import { Dispatch, SetStateAction, useEffect } from 'react';
import { BuildingT } from '../../../../types/generaltypes';
import { RoomAvailabilityT, RoomBookingT } from '../../types/bookingOptions';

/**
 * Custom hook that initializes the state for creating/editing a meeting.
 *
 * @param buildings - An array of buildings.
 * @param setPickedBuilding - A function to set the picked building.
 * @param rooms - An array of room availabilities.
 * @param setPickedRoom - A function to set the picked room.
 * @param pickedRoom - The currently picked room.
 * @param recommendedRoom - The recommended room for the meeting.
 */
export default function useInitialState(
  buildings: BuildingT[],
  setPickedBuilding: Dispatch<SetStateAction<BuildingT | undefined>>,
  rooms: RoomAvailabilityT[],
  setPickedRoom: Dispatch<SetStateAction<RoomAvailabilityT | null | undefined>>,
  pickedRoom?: RoomAvailabilityT | null,
  recommendedRoom?: RoomBookingT
) {
  useEffect(() => {
    if (recommendedRoom?.buildingNumber) {
      setPickedBuilding(
        buildings.find(
          (building) =>
            building.number === recommendedRoom.buildingNumber &&
            building.airportCode === recommendedRoom.airportCode
        )
      );
    }
  }, [
    recommendedRoom?.airportCode,
    recommendedRoom?.buildingNumber,
    setPickedBuilding,
    buildings,
  ]);

  useEffect(() => {
    if (recommendedRoom?.id && pickedRoom === undefined) {
      setPickedRoom(rooms.find((room) => room.id === recommendedRoom.id));
    }
  }, [rooms, recommendedRoom?.id, pickedRoom, setPickedRoom]);
}
