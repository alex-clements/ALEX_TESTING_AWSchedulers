import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  ClickAwayListener,
  Container,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Popper,
  Typography,
  styled,
} from '@mui/material';
import { FlexRow } from '../../components/flexComponents';
import { MdClose, MdOutlineEdit } from 'react-icons/md';
import { zIndexPopper } from './styles/zIndex';
import { BookedMeetingT } from './types';
import { RiDeleteBin6Line } from 'react-icons/ri';
import dayjs from 'dayjs';
import useBookingDelete from '../../hooks/useBookingDelete';
import RedText from '../../components/text/RedText';

interface CalendarPopperIsMeetingInfoProps {
  closePopper: () => void;
  popperAnchor: any;
  isOpen: boolean;
  meeting: BookedMeetingT;
}

const BackgroundPopper = styled(Paper)`
  margin-inline: 20px;
  background-color: '#FFFFFF';
  box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
  height: 300px;
  width: 450px;
  overflow-y: scroll;
`;

const buttonStyle = {};

const CalendarPopperIsMeetingInfo = ({
  closePopper,
  popperAnchor,
  isOpen,
  meeting,
}: CalendarPopperIsMeetingInfoProps) => {
  const {
    attendees,
    startTime,
    endTime,
    name,
    room: {
      name: roomName,
      number: roomNumber,
      floorNumber,
      isActive: roomActive,
    },
    building: {
      airportCode,
      number: buildingNumber,
      location: buildingLocation,
    },
    isOrganizer,
  } = meeting;
  const dayName = dayjs(startTime).format('dddd');
  const formattedStartTime = dayjs(startTime).format('HH:mm');
  const formattedEndTime = dayjs(endTime).format('HH:mm');

  const { isLoading, deleteBooking } = useBookingDelete();
  const handleDeleteMeeting = async () => {
    await deleteBooking(meeting);
  };

  return (
    <Popper
      placement="right-start"
      open={isOpen}
      anchorEl={popperAnchor}
      sx={{ zIndex: zIndexPopper }}
    >
      <ClickAwayListener onClickAway={closePopper}>
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
            <FlexRow>
              {isOrganizer && <EditButtonMenu meeting={meeting} />}
              {isOrganizer && (
                <Button
                  style={buttonStyle}
                  onClick={handleDeleteMeeting}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <RiDeleteBin6Line size={20} />
                  )}
                </Button>
              )}
              <Button style={buttonStyle} onClick={closePopper}>
                <MdClose size={25} />
              </Button>
            </FlexRow>
          </FlexRow>
          <Container>
            <DialogTitle sx={{ pb: 0 }}>{name}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <Typography sx={{ pb: 2 }} variant="subtitle2">
                  {dayName}, {formattedStartTime} - {formattedEndTime}
                </Typography>
                <Typography variant="body1">Location:</Typography>
                {!roomActive ? (
                  <RedText style={{ fontSize: 14, lineHeight: 1 }}>
                    *Meeting room disabled.{' '}
                    {isOrganizer
                      ? 'Please edit booking.'
                      : 'Please contact the meeting organizer to reschedule the meeting.'}
                  </RedText>
                ) : (
                  <>
                    <Typography style={{ fontSize: 12 }} variant="body1">
                      Room: {airportCode} {buildingNumber} - {floorNumber}.
                      {roomNumber} {roomName != '' ? ' - ' + roomName : ''}
                      <br />
                      Building Address: {buildingLocation}
                    </Typography>
                  </>
                )}
                <br />
                <Typography variant="body1">Organizer</Typography>
                <Typography style={{ fontSize: 12 }} variant="body1">
                  {meeting.organizer.name} - {meeting.organizer.email}
                </Typography>
                <br />
                <Typography variant="body1">Attendees:</Typography>
                {!!attendees &&
                  attendees.map((attendee) => {
                    return (
                      <Typography
                        variant="body1"
                        style={{ fontSize: 12 }}
                        key={attendee.email}
                      >
                        {attendee.name} - {attendee.email}
                      </Typography>
                    );
                  })}
              </DialogContentText>
            </DialogContent>
          </Container>
        </BackgroundPopper>
      </ClickAwayListener>
    </Popper>
  );
};

export default CalendarPopperIsMeetingInfo;

import { Grow, MenuItem, MenuList } from '@mui/material';
import { useScheduleGetAllBookingOptions } from '../../hooks/useScheduleGetAllBookingOptions';

const EditButtonMenu = ({ meeting }: { meeting: BookedMeetingT }) => {
  const { isLoading, getBookingOptions } = useScheduleGetAllBookingOptions();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleEditMeeting = async () => {
    await getBookingOptions({
      startTimestamp: meeting.startTime,
      endTimestamp: meeting.endTime,
      audioFnValue: true,
      videoFnValue: true,
      users: meeting.attendees,
      bookingId: meeting.bookingId,
      bookingName: meeting.name,
    });
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    // prettier-ignore
    if (anchorRef.current &&anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        style={buttonStyle}
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MdOutlineEdit size={23} color={meeting.room.isActive ? '' : 'red'} />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  style={{
                    boxShadow: ` 0 24px 38px 3px rgba(0, 0, 0, 0.14),0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2)`,
                  }}
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  <MenuItem style={{ width: 200 }} onClick={handleEditMeeting}>
                    {isLoading ? (
                      <CircularProgress size={20} style={{ marginLeft: 80 }} />
                    ) : (
                      'Edit Meeting'
                    )}
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
