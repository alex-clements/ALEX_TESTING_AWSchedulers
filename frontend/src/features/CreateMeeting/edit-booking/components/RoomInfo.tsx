import { Typography } from '@mui/material';
import { FlexRow } from '../../../../components/flexComponents';
import { RoomBookingT } from '../../types/bookingOptions';

interface RoomInfoProps {
  room: RoomBookingT;
}

export default function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div>
      <Typography
        variant="subtitle1"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: 300,
        }}
      >
        {room.airportCode} {room.buildingNumber}
        {' - '}
        {room.floorNumber}.{room.roomNumber}
        {room.roomName === '' ? '' : ' - ' + room.roomName}
      </Typography>
      <FlexRow justifyContent="flex-start" style={{ gap: 10 }}>
        {/* <Chip label= /> */}
        <Typography variant="subtitle2" style={{ marginRight: 10 }}>
          {'Capacity: ' + room.capacity}
        </Typography>

        <Typography variant="subtitle2" color={room.AV ? 'green' : 'error'}>
          Audio
        </Typography>
        <Typography variant="subtitle2" color={room.VC ? 'green' : 'error'}>
          Video
        </Typography>
      </FlexRow>
    </div>
  );
}
