import { useState } from 'react';
import { Button } from '@mui/material';
import { RecommendationT, RoomBookingT } from '../../types/bookingOptions';
import { FlexColumn } from '../../../../components/flexComponents';
import { AddCircleOutline } from '@mui/icons-material';
import ModalStandardForm from '../../../../components/modal/ModalStandardForm';
import BookingRoomModal from './BookingRoomModal';
import BookingRoom from './BookingRoom';

interface BookingOptionProps {
  recommendation: RecommendationT | null;
}

export default function EditableRecommendation({
  recommendation,
}: BookingOptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {recommendation?.rooms.map((bookingRoomInfo: RoomBookingT) => {
        return (
          <BookingRoom
            key={bookingRoomInfo.id}
            bookingRoomInfo={bookingRoomInfo}
          />
        );
      })}

      <FlexColumn style={{ marginTop: 8 }}>
        <Button onClick={() => setIsModalOpen(true)}>
          <AddCircleOutline style={{marginRight:2}} />
          Add Room
        </Button>
      </FlexColumn>

      <ModalStandardForm open={isModalOpen} handleClose={() => null}>
        <BookingRoomModal handleModalOpen={setIsModalOpen} />
      </ModalStandardForm>
    </>
  );
}
