import { Edit, Delete } from '@mui/icons-material';
import { Chip, Button } from '@mui/material';
import { useState } from 'react';
import { FlexRow } from '../../../../components/flexComponents';
import ModalStandardForm from '../../../../components/modal/ModalStandardForm';
import { useCreateMeetingUpdate } from '../../context/useCreateMeetingContext';
import { RoomBookingT } from '../../types/bookingOptions';
import { removeRoom } from '../lib/editRoom';
import BookingRoomModal from './BookingRoomModal';
import RoomInfo from './RoomInfo';

interface BookingRoomProps {
  bookingRoomInfo: RoomBookingT;
}

export default function BookingRoom({ bookingRoomInfo }: BookingRoomProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();

  return (
    <div
      style={{
        padding: 7,
        borderRadius: 5,
        boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.75)',
        display: 'flex',
        marginBottom: 16,
      }}
    >
      <RoomInfo room={bookingRoomInfo} />
      <FlexRow
        style={{
          gap: 10,
          paddingInline: 40,
          flexWrap: 'wrap',
        }}
      >
        {bookingRoomInfo.attendees.map((attendee) => {
          return <Chip label={attendee.name} />;
        })}
      </FlexRow>
      <FlexRow style={{ marginLeft: 'auto' }}>
        <Button onClick={() => setIsModalOpen(true)}>
          <Edit />
        </Button>
        <Button
          onClick={() =>
            setCreateMeetingInfo((prev) => removeRoom(prev, bookingRoomInfo.id))
          }
        >
          <Delete />
        </Button>
      </FlexRow>

      <ModalStandardForm open={isModalOpen} handleClose={() => null}>
        <BookingRoomModal
          recommendedRoom={bookingRoomInfo}
          handleModalOpen={setIsModalOpen}
        />
      </ModalStandardForm>
    </div>
  );
}
