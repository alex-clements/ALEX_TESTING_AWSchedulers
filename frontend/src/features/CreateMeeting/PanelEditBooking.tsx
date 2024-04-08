import { Alert, Button } from '@mui/material';
import {
  CreateMeetingStage,
  CreateMeetingState,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from './context/useCreateMeetingContext';
import { FlexRow } from '../../components/flexComponents';
import StandardPanel from '../../components/panel/StandardPanel';
import EditBooking from './edit-booking/components/EditBooking';
import { useCallback, useMemo } from 'react';
import MeetingBookingPanelTitle from './components/MeetingBookingPanelTitle';

function PanelEditMeeting() {
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const { participants, bookingInformation, bookingOptions } =
    useCreateMeeting();

  const attendees = bookingInformation?.rooms
    .map((room) => room.attendees)
    .flat();

  const recommendBookingOption = useMemo(
    () =>
      bookingOptions?.find(
        (bookingOption) =>
          bookingOption.recommendationId ===
          bookingInformation?.recommendationId
      ),
    [bookingOptions, bookingInformation?.recommendationId]
  );

  const handleGoBack = useCallback(() => {
    const stage = recommendBookingOption
      ? CreateMeetingStage.ChooseMeetingOption
      : CreateMeetingStage.ChooseBookingTime;

    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        stage,
        ...(recommendBookingOption && {
          bookingInformation: recommendBookingOption,
        }),
      };
    });
  }, [
    bookingOptions,
    bookingInformation?.recommendationId,
    setCreateMeetingInfo,
  ]);

  const handleGoToReviewBooking = () => {
    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        stage: CreateMeetingStage.FinalizeBooking,
      };
    });
  };

  return (
    <StandardPanel
      style={{ flexGrow: 1, paddingLeft: 0 }}
      title={<MeetingBookingPanelTitle panelTitle="Edit Booking:" />}
    >
      {!recommendBookingOption && (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{ margin: 2, marginBottom: 0 }}
        >
          Our apologizes but the system was unable to find rooms that meet the
          meeting requirements. You can try to find rooms manually.
        </Alert>
      )}
      <EditBooking />
      <br />
      <FlexRow justifyContent="space-between">
        <Button variant="outlined" onClick={handleGoBack}>
          Back
        </Button>
        <Button
          disabled={attendees?.length !== participants.length}
          variant="contained"
          color="secondary"
          onClick={handleGoToReviewBooking}
        >
          Finalize Booking
        </Button>
      </FlexRow>
      <br />
    </StandardPanel>
  );
}
export default PanelEditMeeting;
