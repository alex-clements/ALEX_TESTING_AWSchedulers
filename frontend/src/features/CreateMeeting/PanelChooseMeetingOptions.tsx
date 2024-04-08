import FindAvailabilityForm from '../../components/forms/FindAvailabilityForm';
import StandardPanel from '../../components/panel/StandardPanel';

const PanelChooseMeetingOptions = () => {
  return (
    <StandardPanel
      title="Book a Meeting"
      style={{ height: '90vh', width: '400px', minWidth: '340px' }}
    >
      <FindAvailabilityForm
        info={{
          id: 0,
          organizerID: 0,
          participantIDs: [],
          startTime: 0,
          endTime: 0,
          multiRoom: true,
          audio: true,
          video: true,
        }}
        edit={false}
      />
    </StandardPanel>
  );
};

export default PanelChooseMeetingOptions;
