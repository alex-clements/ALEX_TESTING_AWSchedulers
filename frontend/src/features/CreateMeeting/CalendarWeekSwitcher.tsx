import { Button, Typography } from '@mui/material';
import './styles/PanelCalendar.css';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import { FlexColumn, FlexRow } from '../../components/flexComponents';
import {
  CreateMeetingState,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from './context/useCreateMeetingContext';
import dayjs from 'dayjs';
import useScheduleGetAvailability from '../../hooks/useScheduleGetAvailability';
import { UserSimplifiedT, UserT } from '../../types/generaltypes';
import { GetScheduleAvailabilityRequestT } from './types/bookingOptions';
import { getMonToFriDateFormatted } from '../../utils/dateHelpers';

const CalendarWeekSwitcher = ({
  daySwitchingDisabled,
}: {
  daySwitchingDisabled: boolean;
}) => {
  const {
    calendarSettings: { calendarSelectedDay, calendarWeekDays },
    meetingOptions: { audio, video },
    timeslot: { timeStart, timeEnd },
    isAvailabilityRequested,
    participants,
  } = useCreateMeeting();
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const { getScheduleAvailability } = useScheduleGetAvailability();

  const handleSetNewCalendarSettings = async (newDate: string) => {
    let availableTimes = {};
    if (isAvailabilityRequested) {
      availableTimes = await getNewDatesAvailability(newDate);
    }

    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        calendarSettings: {
          calendarSelectedDay: newDate,
          calendarWeekDays: getMonToFriDateFormatted(newDate),
        },
        availableTimes: availableTimes,
      };
    });
  };

  const getNewDatesAvailability = async (startDay: string) => {
    const requestJson: GetScheduleAvailabilityRequestT = {
      users: participants.map((user: UserSimplifiedT) => user.id),
      startDay,
      currentDay: dayjs().format('YYYY-MM-DD'),
    };
    // @ts-ignore
    const availableTimes = await getScheduleAvailability(requestJson);
    return availableTimes;
  };

  const subtractOneWeek = async () => {
    const newDate = dayjs(calendarSelectedDay)
      .subtract(7, 'day')
      .format('YYYY-MM-DD');

    handleSetNewCalendarSettings(newDate);
  };

  const addOneWeek = async () => {
    const newDate = dayjs(calendarSelectedDay)
      .add(7, 'day')
      .format('YYYY-MM-DD');

    handleSetNewCalendarSettings(newDate);
  };

  const handleManualDateChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDate = e.target.value;
    handleSetNewCalendarSettings(newDate);
  };

  return (
    <FlexRow justifyContent="center" style={{ width: '100%', gap: 40 }}>
      <Button disabled={daySwitchingDisabled} onClick={() => subtractOneWeek()}>
        <FlexRow>
          <MdArrowLeft size={35} />
          <Typography variant="body2">Previous Week</Typography>
        </FlexRow>
      </Button>
      <FlexColumn style={{ height: 60 }} justifyContent="flex-start">
        <Typography variant="body2">Week of</Typography>
        <input
          value={calendarSelectedDay}
          onChange={handleManualDateChange}
          type="date"
          disabled={daySwitchingDisabled}
        />
      </FlexColumn>
      <Button disabled={daySwitchingDisabled} onClick={() => addOneWeek()}>
        <FlexRow>
          <Typography variant="body2">Next Week</Typography>
          <MdArrowRight size={35} />
        </FlexRow>
      </Button>
    </FlexRow>
  );
};

export default CalendarWeekSwitcher;
