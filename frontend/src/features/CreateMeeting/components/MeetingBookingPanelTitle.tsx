import { Typography, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { FlexRow } from '../../../components/flexComponents';
import { useCreateMeeting } from '../context/useCreateMeetingContext';

interface MeetingBookingPanelTitleProps {
  panelTitle: string;
  children?: React.ReactNode;
}

export default function MeetingBookingPanelTitle({
  panelTitle,
  children,
}: MeetingBookingPanelTitleProps) {
  const {
    timeslot: { timeStart, timeEnd },
  } = useCreateMeeting();
  return (
    <FlexRow style={{ gap: 10 }} justifyContent="flex-start">
      <Typography variant="h5">{panelTitle}</Typography>
      <Typography variant="h5" color={'secondary'}>
        {dayjs(timeStart).format('dddd, MMM. D, YYYY')}
      </Typography>
      <Chip
        label={`${dayjs(timeStart).format('H:mm')} - ${dayjs(timeEnd).format(
          'H:mm'
        )}`}
        color="secondary"
      />
      {children}
    </FlexRow>
  );
}
