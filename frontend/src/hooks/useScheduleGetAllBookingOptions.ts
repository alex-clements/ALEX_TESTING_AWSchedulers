import { ScheduleService } from '../services/schedule-service';
import { BookingOptionsRequestT } from '../features/CreateMeeting/types/bookingOptions';
import { enqueueSnackbar } from 'notistack';
import { errorScheduleGetAllBookingOptionsSnackbarMessage } from '../constants/snackbarMessages';
import {
  CreateMeetingStage,
  CreateMeetingState,
  useCreateMeeting,
  useCreateMeetingUpdate,
} from '../features/CreateMeeting/context/useCreateMeetingContext';
import { formatTimeIsoString } from '../utils/dateHelpers';
import { useEffect, useState } from 'react';
import { UserSimplifiedT } from '../types/generaltypes';

interface getBookingOptionsInterface {
  startTimestamp: string;
  endTimestamp: string;
  audioFnValue?: boolean;
  videoFnValue?: boolean;
  users?: UserSimplifiedT[];
  bookingId?: string;
  bookingName?: string;
}

export const useScheduleGetAllBookingOptions = () => {
  const scheduleService = new ScheduleService();
  const {
    meetingOptions: { audio, video, singleRoom },
    participants,
  } = useCreateMeeting();
  const { setCreateMeetingInfo } = useCreateMeetingUpdate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [isLoading]);

  // prettier-ignore
  const getBookingOptions = async ({startTimestamp, endTimestamp, audioFnValue , videoFnValue , users, bookingId, bookingName}: getBookingOptionsInterface) => {
    setIsLoading(true);

    let meetingUsers : UserSimplifiedT[];
    let meetingUsersIds : string[];
  
    if(users === undefined && participants === undefined){
      meetingUsersIds = []
      meetingUsers = []
    } else if(users === undefined){
      meetingUsersIds = participants.map((user) => user.id)
      meetingUsers = participants
    } else {
      meetingUsersIds = users.map((user) => user.id)
      meetingUsers = users
    }

    const requestBookingOptions: BookingOptionsRequestT = {
      users: meetingUsersIds,
      AV: audioFnValue || audio,
      VC: videoFnValue || video,
      singleRoom: singleRoom,
      startTime: formatTimeIsoString(startTimestamp),
      endTime: formatTimeIsoString(endTimestamp),
      replaceMeeting: bookingId !== undefined,
    };

    try {
      const scheduleData = await scheduleService.post_getBookingOptions(requestBookingOptions);
      if (scheduleData.error) {
        throw new Error(scheduleData.error);
      }
      setIsLoading(false);
      const hasRecommendations = !!scheduleData.recommendations.length
      const stage = hasRecommendations ? CreateMeetingStage.ChooseMeetingOption : CreateMeetingStage.EditMeeting
      setCreateMeetingInfo((createMeetingInfo: CreateMeetingState) => {
        return {
          ...createMeetingInfo,
          stage,
          bookingOptions: scheduleData.recommendations,
          bookingInformation: null,
          timeslot: {
            timeStart: startTimestamp,
            timeEnd: endTimestamp,
          },
          rescheduledBooking: {
            bookingId: bookingId || null,
            bookingName: bookingName || '',
          },
          participants: scheduleData.participants || meetingUsers,
        };
      });

    } catch (error : any) {
      setIsLoading(false);
      if (error?.response?.data?.error === undefined) {
        const status = error.response?.status
        enqueueSnackbar(`${status ? status + ':' : ''} ${errorScheduleGetAllBookingOptionsSnackbarMessage}`,{ variant: 'error' });
      } else {
        enqueueSnackbar(error.response.data.error,{ variant: 'error' }
        );
      }
    }
  };
  return { isLoading, getBookingOptions };
};
