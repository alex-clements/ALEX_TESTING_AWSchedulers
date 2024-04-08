import { Paper, Typography, styled } from '@mui/material';
import React, { memo } from 'react';
import { daysHash, timeslotsHashReversed } from './contants/timeContants';
import { BookedMeetingT } from './types';
import { zIndexBookedMeetings } from './styles/zIndex';
import { FlexColumn } from '../../components/flexComponents';
import TextNoWrap from '../../components/flexComponents/TextNoWrap';
import CalendarPopperIsMeetingInfo from './CalendarPopperMeetingInfo';
import { useScheduleGetAllBookedMeetings } from '../../hooks/useScheduleGetAllBookedMeetings';
import { extraColors } from '../../styles/theme';
import dayjs from 'dayjs';

interface HoverablePaperProps {
  disabled?: boolean;
}

const HoverablePaper = styled(Paper)<HoverablePaperProps>`
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  ${(props) =>
    props.disabled &&
    `
      border: 2px solid red;
      animation: blinker 1s linear infinite;
    `}

  @keyframes blinker {
    50% {
      border-color: transparent;
    }
  }
`;

const CalendarBookedMeetings = memo(() => {
  const {
    isLoadingBookedMeetings,
    bookedMeetings,
    isErrorLoadingBookedMeetings,
  } = useScheduleGetAllBookedMeetings();

  return bookedMeetings.map((meeting: BookedMeetingT) => {
    return <CalendarBookedMeeting meeting={meeting} />;
  });
});

const CalendarBookedMeeting = ({ meeting }: { meeting: BookedMeetingT }) => {
  const {
    startTime,
    endTime,
    name,
    room: { isActive: roomActive },
  } = meeting;
  const day = dayjs(startTime).format('ddd').toUpperCase();
  const formattedStartTime = dayjs(startTime).format('H:mm');
  const formattedEndTime = dayjs(endTime).format('H:mm');

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenPopper = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <CalendarPopperIsMeetingInfo
        closePopper={handleClosePopper}
        popperAnchor={anchorEl}
        isOpen={anchorEl !== null}
        meeting={meeting}
      />
      <HoverablePaper
        onClick={handleOpenPopper}
        style={{
          backgroundColor: extraColors.bookedMeetingColor,
          gridRow: `${timeslotsHashReversed[formattedStartTime] + 1} / ${
            timeslotsHashReversed[formattedEndTime] + 1
          }`,
          zIndex: zIndexBookedMeetings,
          gridColumn: daysHash[day],
        }}
        elevation={3}
        disabled={!roomActive}
      >
        <FlexColumn alignItems="flex-start" style={{ paddingInline: 10 }}>
          <TextNoWrap style={{ flexGrow: 1 }}>
            <Typography
              style={{
                paddingBlock: 2,
              }}
              variant="caption"
            >
              {name}
            </Typography>
          </TextNoWrap>
          <TextNoWrap>
            <Typography style={{ lineHeight: 1 }} variant="caption">
              {formattedStartTime} - {formattedEndTime}
            </Typography>
          </TextNoWrap>
        </FlexColumn>
      </HoverablePaper>
    </>
  );
};

export default CalendarBookedMeetings;
