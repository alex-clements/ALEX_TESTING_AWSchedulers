import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, styled } from '@mui/material';
import './styles/PanelCalendar.css';
import { FlexColumn } from '../../components/flexComponents';
import { days } from './mocks/calendar';
import {
  daysHash,
  timeslots,
  timeslotsHash,
  timeslotsHashInput,
} from './contants/timeContants';
import CalendarPopperIsCorrectTime from './CalendarPopperIsCorrectTime';
import CalendarBookedMeetings from './CalendarBookedMeetings';
import { zIndexNewMeetings } from './styles/zIndex';
import { DayAvailableHashT } from './types';
import TextNoWrap from '../../components/flexComponents/TextNoWrap';
import CalendarWeekSwitcher from './CalendarWeekSwitcher';
import {
  CreateMeetingStage,
  useCreateMeeting,
} from './context/useCreateMeetingContext';
import StandardPanel from '../../components/panel/StandardPanel';
import dayjs from 'dayjs';
import { getNextFiveDays, isTimeGreaterThan } from '../../utils/dateHelpers';
import { extraColors } from '../../styles/theme';
import CalendarLegend from './CalendarLegend';
import { enqueueSnackbar } from 'notistack';
import { errorInvalidMeetingTime } from '../../constants/snackbarMessages';

export interface CalendarInfoStateT {
  popperOpen: boolean;
  popperAnchor: any;
  startCellRow: number;
  endCellRow: number;
  startTime: string;
  endTime: string;
  day: string;
  fullDate: string;
  dragging: boolean;
  draggingDisabled: boolean;
}

const CalendarInfoReset = {
  popperOpen: false,
  popperAnchor: null,
  startCellRow: -1,
  endCellRow: -1,
  startTime: '',
  endTime: '',
  day: '',
  fullDate: '',
  dragging: false,
  draggingDisabled: false,
};

const PanelCalendar = () => {
  const [calendarInfo, setCalendarInfo] = useState(CalendarInfoReset);
  const { stage } = useCreateMeeting();

  const closePopper = useCallback(() => {
    setCalendarInfo(CalendarInfoReset);
  }, []);

  const setStartTime = (startTime: string) => {
    setCalendarInfo((calendarInfo) => ({ ...calendarInfo, startTime }));
  };

  const setEndTime = (endTime: string) => {
    setCalendarInfo((calendarInfo) => ({ ...calendarInfo, endTime }));
  };

  const title =
    stage === CreateMeetingStage.FindAvailability
      ? 'Your Meetings'
      : 'Select Meeting Time';

  return (
    <StandardPanel title={title} style={{ flexGrow: 1 }}>
      <br />
      <CalendarLegend />
      <br />
      <CalendarWeekSwitcher
        daySwitchingDisabled={calendarInfo.draggingDisabled}
      />
      <Calendar calendarInfo={calendarInfo} setCalendarInfo={setCalendarInfo} />
      <CalendarPopperIsCorrectTime
        setStartTime={setStartTime}
        setEndTime={setEndTime}
        closePopper={closePopper}
        calendarInfo={calendarInfo}
      />
    </StandardPanel>
  );
};

interface DraggingInfo {
  x: number | null;
  y: number | null;
  yPixelStart: number | null;
}

const draggingInfoReset: DraggingInfo = {
  x: null,
  y: null,
  yPixelStart: null,
};

// prettier-ignore
const calculateEndHour = (yPixelStart: number | null, yPixelCurrent: number | null,startCellRow: number) => {
    if (yPixelStart === null || yPixelCurrent === null) {
      return 0;
    }
    const yPixelsMoved = yPixelCurrent - yPixelStart;
    const sizeOfTimeSlotCellMinus1Pixel = 11;
    const timeslotsCovered = Math.round(yPixelsMoved / sizeOfTimeSlotCellMinus1Pixel);
    return startCellRow + timeslotsCovered;
};

const getDayAndHourFromCell = (e: any) => {
  const classes = e.target.className.split(' ');
  const day = classes[1].split('-')[0];
  const hour = parseInt(classes[1].split('-')[1]);
  return { day, hour };
};

const Calendar = ({
  calendarInfo,
  setCalendarInfo,
}: {
  calendarInfo: CalendarInfoStateT;
  setCalendarInfo: React.Dispatch<React.SetStateAction<CalendarInfoStateT>>;
}) => {
  const [draggingInfo, setDraggingInfo] =
    useState<DraggingInfo>(draggingInfoReset);
  const {
    stage,
    calendarSettings: { calendarWeekDays },
    availableTimes,
  } = useCreateMeeting();

  // Prior to Dragging - Track Mouse Position
  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  // During Dragging - Track Mouse Position
  useEffect(() => {
    if (calendarInfo.dragging) {
      window.addEventListener('mouseup', handleDraggingCellMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleDraggingCellMouseUp);
    };
  }, [calendarInfo.dragging]);

  const updateMousePosition = (ev: any) => {
    setDraggingInfo((draggingInfo) => {
      return {
        ...draggingInfo,
        x: ev.clientX,
        y: ev.clientY,
      };
    });
  };

  const handleDraggingCellMouseUp = (e: any) => {
    e.preventDefault();

    const yPixelcurrent = e.clientY;

    let endCellRow = calculateEndHour(
      draggingInfo.yPixelStart,
      yPixelcurrent,
      calendarInfo.startCellRow
    );

    // Booking Start === Booking End; 7:00 - 7:00
    if (calendarInfo.startCellRow === endCellRow) {
      endCellRow = endCellRow + 1;
    }
    // Booking Time Fails
    if (
      timeslotsHashInput[calendarInfo.startCellRow] === undefined ||
      timeslotsHashInput[endCellRow] === undefined ||
      draggingInfo.yPixelStart === null ||
      yPixelcurrent < draggingInfo.yPixelStart
    ) {
      setCalendarInfo({
        ...calendarInfo,
        dragging: false,
        draggingDisabled: false,
      });
      enqueueSnackbar(errorInvalidMeetingTime, { variant: 'error' });
      return;
    }

    if (calendarInfo.dragging) {
      setCalendarInfo({
        ...calendarInfo,
        popperOpen: true,
        endCellRow: endCellRow,
        endTime: timeslotsHashInput[endCellRow],
        dragging: false,
        draggingDisabled: true,
      });
    }
  };

  // prettier-ignore
  const handleDraggingCellMouseDown = (e: any,isBookableTimeslot: boolean) => {
    e.preventDefault();

    if (
      stage !== CreateMeetingStage.ChooseBookingTime ||
      !isBookableTimeslot
    ) {
      return;
    }

    const { day, hour } = getDayAndHourFromCell(e);

    setCalendarInfo((calendarInfo) => ({
      ...calendarInfo,
      popperOpen: false,
      popperAnchor: e.currentTarget,
      startCellRow: hour+1,
      startTime: timeslotsHashInput[hour+1],
      day: day,
      // @ts-ignore
      fullDate: dayjs(calendarWeekDays[day]).format('YYYY-MM-DD'),
      dragging: true,
      draggingDisabled: false,
    }));

    setDraggingInfo((draggingInfo) => ({
      ...draggingInfo,
      yPixelStart: e.clientY,
    }));
  };

  const calculateCurrentEndCell = () => {
    let currentEndCell = -1;
    if (calendarInfo.dragging) {
      // prettier-ignore
      currentEndCell = calculateEndHour( draggingInfo.yPixelStart, draggingInfo.y, calendarInfo.startCellRow);
    }
    if (calendarInfo.draggingDisabled) {
      currentEndCell = calendarInfo.endCellRow;
    }
    return currentEndCell;
  };

  const currentEndCellRow = calculateCurrentEndCell();
  return (
    <div className="schedule">
      <CalenderDaysHeader />
      <div className="schedule-body">
        <CalendarBookedMeetings />
        <CalendarCellDraggable
          calendarInfo={calendarInfo}
          currentEndCellRow={currentEndCellRow}
        />
        {timeslots.map((hour, cellRow) => (
          <React.Fragment key={hour}>
            {(cellRow - 1) % 4 === 0 && <div className="hour">{hour}</div>}
            {days.map((day) => {
              return (
                <CalendarCellStandard
                  cellRow={cellRow}
                  day={day}
                  hour={hour}
                  handleDraggingCellMouseDown={handleDraggingCellMouseDown}
                  stage={stage}
                  draggingEnabledButNotStarted={
                    !calendarInfo.dragging && !calendarInfo.draggingDisabled
                  }
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const CalenderDaysHeader = memo(() => {
  const {
    calendarSettings: { calendarWeekDays },
  } = useCreateMeeting();

  return (
    <div className="schedule-header">
      <div className="day" />
      {Object.entries(calendarWeekDays).map(({ 0: dayName, 1: date }) => {
        const dayNumber = dayjs(date).format('D');

        return (
          <FlexColumn>
            <Typography variant="body2">{dayName}</Typography>
            <Typography variant="h5">
              <b>{dayNumber}</b>
            </Typography>
          </FlexColumn>
        );
      })}
    </div>
  );
});

interface StyledTimeslotProps {
  showUnbookableTimeslotCSS: boolean;
  isCellBorderRequired: boolean;
  draggingEnabledButNotStarted: boolean;
  cellRow: number;
  cellColumn: number;
}

// prettier-ignore
const CellStyles = styled('div')(({ showUnbookableTimeslotCSS, isCellBorderRequired,draggingEnabledButNotStarted, cellRow, cellColumn }: StyledTimeslotProps) => ({
    gridRow: cellRow,
    gridColumn: cellColumn,
    // Cell-border occurs every - 1 hr (4 cells)
    ...(isCellBorderRequired && {
      borderBottom: `1px solid ${extraColors.cellBorderColor}`,
    }),
    // Unbookable timeslot are greyed out
    ...(!showUnbookableTimeslotCSS ? {
        backgroundColor: extraColors.unavailableTimeslotColor,
        
      } : { 
        backgroundColor: extraColors.availableTimeslotColor, 
        cursor: "grab"
      }),
    ...(draggingEnabledButNotStarted && {
      ':hover': {
        // Add your hover styles here
        border: 'green 1px solid', // Example hover style
      },
    }),
  })
);

interface CalendarCellStandardProps {
  cellRow: number;
  day: string;
  hour: string;
  handleDraggingCellMouseDown: (e: any, isUnbookableTimeslot: boolean) => void;
  // availableTimes: DayAvailableHashT;
  draggingEnabledButNotStarted: boolean;
  stage: CreateMeetingStage;
}

// prettier-ignore
const CalendarCellStandard = memo(({cellRow,day,hour,draggingEnabledButNotStarted, handleDraggingCellMouseDown,stage}: CalendarCellStandardProps) => {
  const {
    availableTimes,
  } = useCreateMeeting()
  
  let isBookableTimeslot = false;
  if (availableTimes[day] !== undefined && availableTimes[`${day}`][hour] === true) {
    isBookableTimeslot = true;
  }
    const isCellBorderRequired = cellRow % 4 === 0
    const showUnbookableTimeslotCSS = (stage !== CreateMeetingStage.ChooseBookingTime) || (stage === CreateMeetingStage.ChooseBookingTime && isBookableTimeslot)
    return (
    <CellStyles
      key={day + hour}
      onMouseDown={(e) => handleDraggingCellMouseDown(e, isBookableTimeslot)}
      showUnbookableTimeslotCSS={showUnbookableTimeslotCSS}
      isCellBorderRequired={isCellBorderRequired}
      draggingEnabledButNotStarted={draggingEnabledButNotStarted && stage === CreateMeetingStage.ChooseBookingTime && isBookableTimeslot}
      cellRow={cellRow + 1}
      cellColumn={daysHash[day]}
      className={`timeslot ${day}-${cellRow}`}
    />
    );
  }
);

interface CalendarCellDraggableProps {
  calendarInfo: CalendarInfoStateT;
  currentEndCellRow: number;
}

const CalendarCellDraggable = ({
  calendarInfo,
  currentEndCellRow,
}: CalendarCellDraggableProps) => {
  // prettier-ignore
  const isNotHidden = calendarInfo.dragging || calendarInfo.draggingDisabled ? 'block' : 'none';
  // prettier-ignore
  const gridRowStart = calendarInfo.day !== null ? calendarInfo.startCellRow : '';
  const gridRowEnd = calendarInfo.day !== null ? currentEndCellRow : '';
  // prettier-ignore
  const gridColumn = calendarInfo.day !== null ? daysHash[calendarInfo.day] : '';
  return (
    <div
      style={{
        display: isNotHidden,
        gridRowStart: gridRowStart,
        gridRowEnd: gridRowEnd,
        zIndex: zIndexNewMeetings,
        gridColumn: gridColumn,
        backgroundColor: 'rgb(102, 187, 106, 0.7)',
        overflow: 'hidden',
      }}
    >
      <FlexColumn alignItems="flex-start" style={{ paddingLeft: 5 }}>
        <TextNoWrap>
          <Typography
            style={{
              paddingBlock: 2,
              lineHeight: 1,
            }}
            variant="caption"
          >
            (No Title)
          </Typography>
        </TextNoWrap>
        <TextNoWrap>
          <Typography style={{ lineHeight: 1 }} variant="caption">
            {timeslotsHash[calendarInfo.startCellRow]} -
            {timeslotsHash[currentEndCellRow]}
          </Typography>
        </TextNoWrap>
      </FlexColumn>
    </div>
  );
};

export default PanelCalendar;
