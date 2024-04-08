import { useQuery } from '@tanstack/react-query';
import {
  ScheduleService,
  get_bookedMeetingsRoute,
} from '../services/schedule-service';
import { useCreateMeeting } from '../features/CreateMeeting/context/useCreateMeetingContext';
import { formatTo6AM, getRelevantMonday } from '../utils/dateHelpers';

export const useScheduleGetAllBookedMeetings = () => {
  // prettier-ignore
  const {calendarSettings: { calendarSelectedDay }} = useCreateMeeting();
  const scheduleService = new ScheduleService();

  const formattedDate = formatTo6AM(getRelevantMonday(calendarSelectedDay));
  // prettier-ignore
  let { isLoading: isLoadingBookedMeetings, data : bookedMeetings, error: isErrorLoadingBookedMeetings,
  } = useQuery({
    queryKey: [get_bookedMeetingsRoute(formattedDate)],
    queryFn: () => scheduleService.get_bookedMeetings(formattedDate),
  });

  if (isLoadingBookedMeetings || isErrorLoadingBookedMeetings) {
    bookedMeetings = [];
  }

  return {
    isLoadingBookedMeetings,
    bookedMeetings,
    isErrorLoadingBookedMeetings,
  };
};
