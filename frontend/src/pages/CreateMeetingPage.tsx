import MeetingHeader from '../components/headers/MeetingHeader';
import PanelChooseMeetingOptions from '../features/CreateMeeting/PanelChooseMeetingOptions';
import PanelCalendar from '../features/CreateMeeting/PanelCalender';
import PanelPickBookingOption from '../features/CreateMeeting/PanelPickBookingOption';
import PanelEditMeeting from '../features/CreateMeeting/PanelEditBooking';
import PanelFinalizeBooking from '../features/CreateMeeting/PanelFinalizeBooking';
import {
  CreateMeetingProvider,
  CreateMeetingStage,
  useCreateMeeting,
} from '../features/CreateMeeting/context/useCreateMeetingContext';
import { useMemo } from 'react';
import { extraColors } from '../styles/theme';

const CreateMeetingPage = () => {
  return (
    <CreateMeetingProvider>
      <MeetingHeader />
      <div
        style={{
          background: extraColors.createMeetingBackground,
          display: 'flex',
          flexGrow: 1,
          paddingBlock: 30,
          gap: 10,
        }}
      >
        <PanelChooseMeetingOptions />
        <PanelCalendarAndBooking />
      </div>
    </CreateMeetingProvider>
  );
};

const PanelCalendarAndBooking = () => {
  const { stage } = useCreateMeeting();

  const CurrentPanel = useMemo(() => {
    switch (stage) {
      case CreateMeetingStage.FindAvailability:
        return <PanelCalendar />;
      case CreateMeetingStage.ChooseBookingTime:
        return <PanelCalendar />;
      case CreateMeetingStage.ChooseMeetingOption:
        return <PanelPickBookingOption />;
      case CreateMeetingStage.EditMeeting:
        return <PanelEditMeeting />;
      case CreateMeetingStage.FinalizeBooking:
        return <PanelFinalizeBooking />;
    }
  }, [stage]);
  return CurrentPanel;
};

export default CreateMeetingPage;
