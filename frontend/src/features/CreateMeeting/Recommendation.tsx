import React from 'react';
import { RecommendationT, RoomBookingT } from './types/bookingOptions';
import { Chip, Typography } from '@mui/material';
import { FlexRow } from '../../components/flexComponents';

interface BookingOptionProps {
  recommendation: RecommendationT;
}

const Recommendation = ({ recommendation }: BookingOptionProps) => {
  return (
    <>
      {recommendation.rooms.map((bookingRoomInfo: RoomBookingT) => {
        return <BookingRoom bookingRoomInfo={bookingRoomInfo} />;
      })}
    </>
  );
};

interface BookingRoomProps {
  bookingRoomInfo: RoomBookingT;
}

const BookingRoom = ({ bookingRoomInfo }: BookingRoomProps) => {
  return (
    <div
      style={{
        padding: 7,
        borderRadius: 5,
        boxShadow: '0px 0px 2px 0px rgba(0, 0, 0, 0.75)',
        display: 'flex',
      }}
    >
      <div>
        <Typography
          variant="subtitle1"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: 250,
          }}
        >
          {bookingRoomInfo.airportCode} {bookingRoomInfo.buildingNumber}
          {' - '}
          {bookingRoomInfo.floorNumber}.{bookingRoomInfo.roomNumber}
          {bookingRoomInfo.roomName === ''
            ? ''
            : ' - ' + bookingRoomInfo.roomName}
        </Typography>
        <FlexRow justifyContent="flex-start" style={{ gap: 10 }}>
          {/* <Chip label= /> */}
          <Typography variant="subtitle2" style={{ marginRight: 10 }}>
            {'Capacity: ' + bookingRoomInfo.capacity}
          </Typography>

          <Typography
            variant="subtitle2"
            color={bookingRoomInfo.AV ? 'green' : 'error'}
          >
            Audio
          </Typography>
          <Typography
            variant="subtitle2"
            color={bookingRoomInfo.VC ? 'green' : 'error'}
          >
            Video
          </Typography>
        </FlexRow>
      </div>
      <FlexRow
        style={{
          gap: 10,
          paddingInline: 40,
          flexWrap: 'wrap',
        }}
      >
        {bookingRoomInfo.attendees !== undefined &&
          bookingRoomInfo.attendees.map((attendee) => {
            return <Chip label={attendee.name} />;
          })}
      </FlexRow>
    </div>
  );
};

export default Recommendation;
