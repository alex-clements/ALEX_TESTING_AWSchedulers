import { Button, Typography } from '@mui/material';
import { FlexRow } from '../../../../components/flexComponents';
import { AttendeeT, RoomAvailabilityT } from '../../types/bookingOptions';
import { BuildingT } from '../../../../types/generaltypes';
import { Dispatch, SetStateAction } from 'react';

interface BookingModalButtonsProps {
  handleModalOpen: Dispatch<SetStateAction<boolean>>;
  handleSave: () => void;
  pickedUsers: AttendeeT[];
  pickedBuilding?: BuildingT;
  pickedRoom?: RoomAvailabilityT | null;
}

export default function BookingModalButtons({
  handleModalOpen,
  handleSave,
  pickedUsers,
  pickedBuilding,
  pickedRoom,
}: BookingModalButtonsProps) {
  return (
    <FlexRow
      justifyContent="space-between"
      style={{ marginTop: 10, width: '100%' }}
    >
      <Button
        sx={{ width: 100 }}
        variant="outlined"
        color="info"
        onClick={() => handleModalOpen((prev) => !prev)}
      >
        <Typography>Cancel</Typography>
      </Button>
      <Button
        sx={{ width: 100 }}
        variant="contained"
        color="secondary"
        disabled={!pickedRoom || !pickedUsers.length || !pickedBuilding}
        onClick={handleSave}
      >
        <Typography>Save</Typography>
      </Button>
    </FlexRow>
  );
}
