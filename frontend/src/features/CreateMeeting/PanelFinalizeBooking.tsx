import {
  Button,
  Chip,
  Container,
  Paper,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { RecommendationT } from './types/bookingOptions';
import { responseBookingOptions } from './mocks/bookingOptions';
import dayjs from 'dayjs';
import {
  CreateMeetingStage,
  CreateMeetingState,
  createMeetingStateEmpty,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from './context/useCreateMeetingContext';
import { FlexColumn, FlexRow } from '../../components/flexComponents';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import useScheduleAddBooking from '../../hooks/useScheduleAddBooking';
import StandardPanel from '../../components/panel/StandardPanel';
import Recommendation from './Recommendation';
import RedText from '../../components/text/RedText';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import MeetingBookingPanelTitle from './components/MeetingBookingPanelTitle';

const PanelFinalizeBooking = () => {
  const { isLoading, addBooking } = useScheduleAddBooking();
  const { bookingInformation, rescheduledBooking } = useCreateMeeting();
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const [title, setTitle] = useState(rescheduledBooking.bookingName);
  const [description, setDescription] = useState('');

  const handleGoBack = () => {
    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        stage: CreateMeetingStage.EditMeeting,
      };
    });
  };

  const handleSubmitBooking = async () => {
    if (bookingInformation === null) return;

    const booking = await addBooking({
      title,
      description,
    });
    // @ts-ignore
    if (booking && booking.error) {
      return;
    }
    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingStateEmpty,
        calendarSettings: createMeetingInfo.calendarSettings,
      };
    });
  };

  if (bookingInformation === null) return null;

  return (
    <>
      <StandardPanel
        style={{ flexGrow: 1 }}
        title={<MeetingBookingPanelTitle panelTitle="Book Meeting:" />}
      >
        <br />
        <Recommendation recommendation={bookingInformation} />
        <br />
        <br />
        <Typography variant="h6">
          Title<RedText>*</RedText>
        </Typography>

        <TextField
          variant="filled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{
            style: {
              padding: 7,
            },
          }}
        />
        {/* <Typography variant="h6">Description</Typography> */}
        {/* <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          inputProps={{
            style: {
              margin: 0,
              padding: 0,
            },
          }}
          size="small"
          multiline
          rows={6}
          variant="filled"
        /> */}
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleGoBack}>
            Back
          </Button>
          <LoadingButton
            loading={isLoading}
            variant="contained"
            color="secondary"
            onClick={handleSubmitBooking}
          >
            Submit Booking
          </LoadingButton>
        </div>
        <br />
      </StandardPanel>
    </>
  );
};

export default PanelFinalizeBooking;
