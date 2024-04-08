import { Container, Stack, Typography, Chip } from '@mui/material';
import { useMemo } from 'react';
import { useCreateMeeting } from '../../context/useCreateMeetingContext';
import EditableRecommendation from './EditableRecommendation';
import { FlexRow } from '../../../../components/flexComponents';

export default function EditBooking() {
  const { participants, bookingInformation } = useCreateMeeting();
  const assignedParticipants = useMemo(() => {
    const attendes = bookingInformation?.rooms
      .map((room) => room.attendees)
      .flat();
    return attendes?.map((attendee) => attendee.id);
  }, [bookingInformation]);

  const participantsToBeAssigned = useMemo(
    () =>
      participants.filter(
        (participant) => !assignedParticipants?.includes(participant.id)
      ),
    [participants, assignedParticipants]
  );

  return (
    <Container sx={{ py: 2 }}>
      {!!participantsToBeAssigned.length && (
        <FlexRow justifyContent="flex-start">
          <Typography variant="h6" sx={{ marginRight: 2 }}>
            Participants to be added to a room:
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            marginY={2}
            sx={{
              paddingBottom: 1,
              overflowX: 'auto',
              scrollbarWidth: 'auto',
              scrollbarColor: '#232f3e #F5F5F5',
              scrollBehavior: 'smooth',
            }}
          >
            {participantsToBeAssigned.map((participant) => {
              return <Chip key={participant.id} label={participant.name} />;
            })}
          </Stack>
        </FlexRow>
      )}
      <EditableRecommendation recommendation={bookingInformation} />
    </Container>
  );
}
