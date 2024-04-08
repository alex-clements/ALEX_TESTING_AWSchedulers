import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Popper,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { FlexRow } from '../../components/flexComponents';
import { MdClose } from 'react-icons/md';
import { zIndexPopper } from './styles/zIndex';
import {
  CalendarWeekDaysInterface,
  CreateMeetingStage,
  CreateMeetingState,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from './context/useCreateMeetingContext';
import { useScheduleGetAllBookingOptions } from '../../hooks/useScheduleGetAllBookingOptions';
import dayjs from 'dayjs';
import { CalendarInfoStateT } from './PanelCalender';
import { formatTimeIsoString } from '../../utils/dateHelpers';
import { BookingOptionsRequestT } from './types/bookingOptions';
import { LoadingButton } from '@mui/lab';

const BackgroundPopper = styled(Paper)`
  margin-inline: 20px;
  background-color: 'white';
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  height: 300px;
  width: 450px;
  overflow-y: scroll;
`;

interface CalendarPopperIsCorrectTimeProps {
  closePopper: () => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  calendarInfo: CalendarInfoStateT;
}

const calculateDateFromDayName = (
  hashMapOfDayNames: CalendarWeekDaysInterface,
  dayName: string
) => {
  // @ts-ignore
  const date = dayjs(hashMapOfDayNames[dayName]);
  return date;
};

const getDayJsTimestampFromDateAndTime = (date: string, time: string) => {
  return dayjs(`${date}T${time}`);
};

const calculateTimestampFromDateAndTime = (date: string, time: string) => {
  const dateTime = getDayJsTimestampFromDateAndTime(date, time);
  return dateTime.format('YYYY-MM-DD HH:mm:ss');
};

const CalendarPopperIsCorrectTime = ({
  closePopper,
  setStartTime,
  setEndTime,
  calendarInfo,
}: CalendarPopperIsCorrectTimeProps) => {
  const { startTime, endTime, fullDate, popperAnchor, popperOpen } =
    calendarInfo;

  const { getBookingOptions, isLoading } = useScheduleGetAllBookingOptions();

  const handleBookMeetingTime = async () => {
    // prettier-ignore
    const startTimestamp = calculateTimestampFromDateAndTime(fullDate,startTime);
    const endTimestamp = calculateTimestampFromDateAndTime(fullDate, endTime);

    await getBookingOptions({ startTimestamp, endTimestamp });
  };

  return (
    <Popper
      placement="right-start"
      open={popperOpen}
      anchorEl={popperAnchor}
      sx={{ zIndex: zIndexPopper }}
    >
      <BackgroundPopper>
        <FlexRow
          justifyContent="space-between"
          style={{
            backgroundColor: '#F2F3F4',
            height: 40,
            paddingInline: 20,
          }}
        >
          <div />
          <MdClose size={25} onClick={closePopper} />
        </FlexRow>
        <Container>
          <DialogTitle>Is this Meeting Date and Time Correct?</DialogTitle>
          <DialogContent>
            <Typography
              sx={{ marginLeft: 1, marginBottom: 1 }}
              variant="subtitle1"
            ></Typography>
            <FlexRow justifyContent={'space-around'}>
              <Typography variant="h4">{startTime}</Typography>
              {/* <TextField
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              /> */}
              to
              <Typography variant="h4">{endTime}</Typography>
              {/* <TextField
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              /> */}
            </FlexRow>
          </DialogContent>
          <DialogActions>
            <Button sx={{ marginRight: 3 }} onClick={closePopper}>
              Cancel
            </Button>
            <LoadingButton
              loading={isLoading}
              variant="contained"
              color="secondary"
              type="submit"
              onClick={handleBookMeetingTime}
            >
              Book Meeting
            </LoadingButton>
          </DialogActions>
        </Container>
      </BackgroundPopper>
    </Popper>
  );
};

export default CalendarPopperIsCorrectTime;
