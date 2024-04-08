import { Typography } from '@mui/material';
import { FlexRow } from '../../../../components/flexComponents';
import { RoomAvailabilityT } from '../../types/bookingOptions';

interface RoomInfoSelectItemProps {
  room: RoomAvailabilityT;
}

export default function RoomSelectItem({ room }: RoomInfoSelectItemProps) {
  return (
    <>
      <Typography
        variant="body2"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: 200,
          minWidth: 100,
        }}
      >
        {room.floorNumber}.{room.roomNumber}
        {room.roomName === '' ? '' : ' - ' + room.roomName}
      </Typography>
      <FlexRow style={{ gap: 10 }}>
        <Typography variant="subtitle2" sx={{ width: 75 }} align="center">
          {room.capacity}
        </Typography>

        <Typography
          variant="subtitle2"
          color={room.AV ? 'green' : 'error'}
          align="center"
          sx={{ width: 25 }}
        >
          {room.AV ? '✓' : '✗'}
        </Typography>
        <Typography
          variant="subtitle2"
          color={room.VC ? 'green' : 'error'}
          align="center"
          sx={{ width: 25 }}
        >
          {room.VC ? '✓' : '✗'}
        </Typography>
        <Typography
          sx={{ width: 50 }}
          variant="subtitle2"
          color={room.available ? 'green' : 'error'}
          align="center"
        >
          {room.available ? '✓' : '✗'}
        </Typography>
      </FlexRow>
    </>
  );
}
