import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  PaperProps,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import { RecommendationT } from './types/bookingOptions';
import {
  CreateMeetingStage,
  CreateMeetingState,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from './context/useCreateMeetingContext';
import { FlexRow } from '../../components/flexComponents';
import StandardPanel from '../../components/panel/StandardPanel';
import Recommendation from './Recommendation';
import { FilterBar } from '../../components/filters/FilterBar';
import { useState, useEffect } from 'react';
import { FilterAlt, Info, Warning } from '@mui/icons-material';
import MeetingBookingPanelTitle from './components/MeetingBookingPanelTitle';
import BasicIconModal from '../../components/modal/BasicIconModal';

const EXPLAIN_SCHEDULING = `
Participants are grouped by proximity. They are placed in buildings within 400 meters of themselves. 
Rooms within a building are prioritized based on meeting capabilities, minimizing capacity wasted, and minimizing travel distance between floors. 
In the next step, you can review and modify a recommendation by clicking "Continue."
`;

const PanelPickBookingOption = () => {
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const createMeetingInfo = useCreateMeeting();
  const {
    bookingInformation,
    meetingOptions: { singleRoom },
  } = createMeetingInfo;
  const [avFilter, setAvFilter] = useState<boolean>(false);
  const [vcFilter, setVcFilter] = useState<boolean>(false);
  const [maxCapacityFilter, setMaxCapacityFilter] = useState<string>('');
  const [minCapacityFilter, setMinCapacityFilter] = useState<string>('');
  const [roomCapacities, setRoomCapacities] = useState<number[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(true);

  const handleGoBack = () => {
    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      let previousStage = CreateMeetingStage.ChooseBookingTime;
      // If we are replacing a booking, we should go back to the Find Availability Stage
      if (createMeetingInfo.rescheduledBooking.bookingId !== null) {
        previousStage = CreateMeetingStage.FindAvailability;
      }
      return {
        ...createMeetingInfo,
        stage: previousStage,
      };
    });
  };

  const handleSubmitBooking = () => {
    if (createMeetingInfo.bookingInformation === null) return;

    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        stage: CreateMeetingStage.EditMeeting,
      };
    });
  };

  return (
    <StandardPanel
      style={{ flexGrow: 1, paddingLeft: 0 }}
      title={
        <MeetingBookingPanelTitle panelTitle="Pick a Booking Option:">
          <IconButton
            sx={{ color: 'white', marginLeft: 'auto', padding: 0.5 }}
            onClick={() => setShowFilter((c) => !c)}
          >
            <FilterAlt />
          </IconButton>
          {!singleRoom && (
            <Tooltip title={<h2>{EXPLAIN_SCHEDULING}</h2>}>
              <IconButton sx={{ color: 'white', padding: 0.5 }}>
                <Info></Info>
              </IconButton>
            </Tooltip>
          )}
        </MeetingBookingPanelTitle>
      }
      subTitle={
        <FilterBar
          onSelectAv={(e) => setAvFilter(e.target.checked)}
          onSelectVc={(e) => setVcFilter(e.target.checked)}
          onSetMaxCapacity={(e) => setMaxCapacityFilter(e)}
          onSetMinCapacity={(e) => setMinCapacityFilter(e)}
          roomCapacities={roomCapacities}
          visible={showFilter}
        />
      }
    >
      <BookingOptions
        filters={{ avFilter, vcFilter, maxCapacityFilter, minCapacityFilter }}
        updateRoomCapacities={setRoomCapacities}
      />

      <br />
      <FlexRow justifyContent="space-between">
        <Button variant="outlined" onClick={handleGoBack}>
          Back
        </Button>
        <Button
          disabled={bookingInformation === null}
          variant="contained"
          color="secondary"
          onClick={handleSubmitBooking}
        >
          Continue
        </Button>
      </FlexRow>
      <br />
    </StandardPanel>
  );
};

// Extend the PaperProps type with your custom props
interface HoverablePaperProps extends PaperProps {
  isSelected?: boolean;
}

const HoverablePaper = styled(Paper)<HoverablePaperProps>`
  width: 80%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.15s ease;
  margin: 20px;
  border: 1px solid #d4d4d4;
  ${(props) =>
    props.isSelected &&
    `
      background-color: rgba(255, 166, 0, 0.3);
    `}
  &:hover {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.75);
  }
`;

const ScrollableContainer = styled('div')(() => ({
  overflowY: 'scroll',
  overflowX: 'hidden',
  height: '60vh',

  // Custom scrollbar styles
  '&::-webkit-scrollbar': {
    WebkitAppearance: 'none',
    width: '7px',
  },

  '&::-webkit-scrollbar-thumb': {
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    boxShadow: '0 0 1px rgba(255, 255, 255, 0.5)',
  },
}));

interface BookingOptionsProps {
  updateRoomCapacities: (capacities: number[]) => void;
  filters: {
    avFilter: boolean;
    vcFilter: boolean;
    maxCapacityFilter: string;
    minCapacityFilter: string;
  };
}

const BookingOptions = ({
  filters,
  updateRoomCapacities,
}: BookingOptionsProps) => {
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const { bookingInformation, bookingOptions, participants } =
    useCreateMeeting();

  const handleOnSelectBookingOption = (recommendation: RecommendationT) => {
    setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
      return {
        ...createMeetingInfo,
        bookingInformation: recommendation,
      };
    });
  };

  useEffect(() => {
    const capacityList =
      bookingOptions
        ?.map((recommendation) => {
          const roomCapacities: number[] = [];
          recommendation.rooms.forEach((room) => {
            roomCapacities.push(room.capacity);
          });
          return roomCapacities;
        })
        .flat(2)
        .filter((v, i, self) => {
          return i == self.indexOf(v);
        })
        .sort((a, b) => a - b) || [];

    updateRoomCapacities(capacityList);
  }, [bookingOptions]);

  if (!bookingOptions) {
    return <CircularProgress />;
  }

  const assignedParticipants = bookingOptions[0].rooms
    .map((room) => room.attendees)
    .flat();

  const isAllParticipantsAssigned =
    assignedParticipants?.length === participants.length;

  return (
    <>
      <ScrollableContainer>
        {!isAllParticipantsAssigned && (
          <Alert severity="warning" variant="outlined" sx={{ margin: 2 }}>
            A Room was not found for all participants. If you wish, you can
            manually try to find a room in the next step.
          </Alert>
        )}
        {bookingOptions
          .filter((recommendation: RecommendationT) => {
            let works: boolean = true;
            recommendation.rooms.forEach((room) => {
              if (filters.avFilter && !room.AV) works = false;
              if (filters.vcFilter && !room.VC) works = false;
              if (
                filters.maxCapacityFilter != '' &&
                room.capacity > parseInt(filters.maxCapacityFilter)
              )
                works = false;

              if (
                filters.minCapacityFilter != '' &&
                room.capacity < parseInt(filters.minCapacityFilter)
              )
                works = false;
            });
            return works;
          })
          .map((recommendation: RecommendationT, optionNumber) => {
            let travelWarningText =
              'Participants traveling more than 400 meters to the meeting location: \n';
            const travelingFar = recommendation?.distances?.filter(
              (userDistance) => {
                const isTravelingFar = userDistance.distance > 0.4;
                if (isTravelingFar) {
                  travelWarningText += `${
                    userDistance.user.name
                  } is traveling ${userDistance.distance.toFixed(2)} km\n`;
                }
                return isTravelingFar;
              }
            );

            travelWarningText += `\nTotal Travel Distance for All Participants: ${recommendation?.totalDistance?.toFixed(
              2
            )} km \n`;
            const showTravelWarning = !!travelingFar?.length;
            const isBookingOptionSelected =
              bookingInformation?.recommendationId ===
              recommendation.recommendationId;
            return (
              <HoverablePaper
                style={{ width: '95%' }}
                isSelected={isBookingOptionSelected}
                onClick={() => handleOnSelectBookingOption(recommendation)}
              >
                <FlexRow justifyContent="flex-start">
                  <Typography variant="h6">
                    Option {optionNumber + 1}
                  </Typography>
                  {showTravelWarning && (
                    <div style={{ marginLeft: 'auto' }}>
                      <BasicIconModal
                        title="Travel Warning"
                        text={travelWarningText}
                      >
                        <Warning color="secondary" />
                      </BasicIconModal>
                    </div>
                  )}
                </FlexRow>
                <Recommendation recommendation={recommendation} />
              </HoverablePaper>
            );
          })}
      </ScrollableContainer>
    </>
  );
};

export default PanelPickBookingOption;
