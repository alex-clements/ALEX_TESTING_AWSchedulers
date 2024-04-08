import { useQueryClient } from '@tanstack/react-query';
import { ScheduleService } from '../services/schedule-service';
import { GetScheduleAvailabilityRequestT } from '../features/CreateMeeting/types/bookingOptions';
import { createTimeHashMap } from '../utils/createTimeHashMap';
import {
  formatTimeIsoString,
  formatTo6AM,
  getRelevantMonday,
} from '../utils/dateHelpers';
import { errorScheduleGetAvailabilitySnackbarMessage } from '../constants/snackbarMessages';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';

const useScheduleGetAvailability = () => {
  const scheduleService = new ScheduleService();
  const queryClient = useQueryClient();

  const getScheduleAvailability = async (
    data: GetScheduleAvailabilityRequestT
  ) => {
    let scheduleAvailability;
    const { users, startDay } = data;

    const transformedStartDate = formatTo6AM(getRelevantMonday(startDay));

    try {
      scheduleAvailability = await scheduleService.get_scheduleAvailability({
        users,
        startDay: transformedStartDate,
        currentDay: formatTo6AM(formatTimeIsoString(new Date())),
      });
      const hashmap = await createTimeHashMap(scheduleAvailability);
      return hashmap;
    } catch (error) {
      if (error instanceof AxiosError && error.response !== undefined) {
        enqueueSnackbar(
          `${error.response.status}: ${errorScheduleGetAvailabilitySnackbarMessage}`,
          { variant: 'error' }
        );
      } else {
        // handle other errors
        enqueueSnackbar(
          `${errorScheduleGetAvailabilitySnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
      }
      scheduleAvailability = {
        error: 'An error occured while adding the room. Please try again.',
      };
    }
    return scheduleAvailability;
  };
  return { getScheduleAvailability };
};

export default useScheduleGetAvailability;
