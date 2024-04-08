import SelectLocation from './SelectLocation';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useBuildingGetAllActive } from '../../../../hooks/useBuildingGetAllActive';
import { BuildingT } from '../../../../types/generaltypes';
import { useGetAvailableRooms } from '../../../../hooks/useGetAvaliableRooms';
import {
  RoomBookingT,
  RoomAvailabilityT,
  AttendeeT,
} from '../../types/bookingOptions';
import { FlexColumn } from '../../../../components/flexComponents';
import SelectUsers from './SelectUsers';
import { useCreateMeetingUpdate } from '../../context/useCreateMeetingContext';
import { updateRooms } from '../lib/editRoom';
import useInitialState from '../hooks/useInitialState';
import useHandlePick from '../hooks/useHandlePick';
import BookingModalButtons from './BookingModalButtons';

interface BookingRoomFormProps {
  recommendedRoom?: RoomBookingT;
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function BookingRoomModal({
  recommendedRoom,
  handleModalOpen,
}: BookingRoomFormProps) {
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();

  const [pickedBuilding, setPickedBuilding] = useState<BuildingT>();
  const [pickedRoom, setPickedRoom] = useState<RoomAvailabilityT | null>();
  const [pickedUsers, setPickedUsers] = useState<AttendeeT[]>(
    recommendedRoom?.attendees || []
  );

  const {
    buildings,
    isLoading: isBuildingLoading,
    error: buildingError,
  } = useBuildingGetAllActive();

  const {
    rooms,
    isLoading: isRoomsLoading,
    error: roomsError,
  } = useGetAvailableRooms(pickedBuilding?.id);

  useInitialState(
    buildings,
    setPickedBuilding,
    rooms,
    setPickedRoom,
    pickedRoom,
    recommendedRoom
  );

  const {
    handleChangeBuilding,
    handleChangeRoom,
    handleChangeUsers,
    pickedUserAlerts,
  } = useHandlePick(
    buildings,
    rooms,
    pickedUsers,
    setPickedUsers,
    setPickedBuilding,
    setPickedRoom,
    pickedRoom
  );

  const handleSave = useCallback(() => {
    if (!pickedRoom || !pickedUsers.length || !pickedBuilding) return;
    setCreateMeetingInfo((prev) =>
      updateRooms(
        prev,
        pickedBuilding,
        pickedRoom,
        pickedUsers,
        recommendedRoom
      )
    );
    handleModalOpen(false);
  }, [
    pickedRoom,
    pickedUsers,
    pickedBuilding,
    setCreateMeetingInfo,
    handleModalOpen,
    recommendedRoom,
  ]);

  const buildingLoadingMessage = isBuildingLoading
    ? 'Loading buildings...'
    : '';
  const roomsLoadingMessage = isRoomsLoading ? 'Loading rooms...' : '';

  return (
    <FlexColumn>
      <h2>Room Booking</h2>
      <SelectLocation
        items={buildings}
        pickedItemId={pickedBuilding?.id}
        label="Building"
        handleChange={handleChangeBuilding}
        disabled={isBuildingLoading}
        error={buildingError?.message}
        loadingMessage={buildingLoadingMessage}
      />
      <br />
      {pickedBuilding?.id && (
        <SelectLocation
          pickedItemId={pickedRoom?.id}
          label="Room"
          items={rooms}
          handleChange={handleChangeRoom}
          disabled={isRoomsLoading || !!roomsError}
          error={roomsError}
          loadingMessage={roomsLoadingMessage}
        />
      )}
      {pickedRoom?.id && (
        <SelectUsers
          currentRoomUsers={pickedUsers}
          handleChange={handleChangeUsers}
          pickedUserAlerts={pickedUserAlerts}
          isRoomFull={pickedUsers.length === pickedRoom.capacity}
        />
      )}
      <BookingModalButtons
        handleModalOpen={handleModalOpen}
        handleSave={handleSave}
        pickedUsers={pickedUsers}
        pickedBuilding={pickedBuilding}
        pickedRoom={pickedRoom}
      />
    </FlexColumn>
  );
}
