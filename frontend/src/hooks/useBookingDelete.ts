import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import {
  errorDeleteBookingSnackbarMessage,
  errorUnauthorisedAccess,
  successfulDeleteBookingSnackbarMessage,
} from '../constants/snackbarMessages';
import { AxiosError } from 'axios';
import { BookedMeetingT } from '../features/CreateMeeting/types';
import { ScheduleService } from '../services/schedule-service';
import { useState } from 'react';

const useBookingDelete = () => {
  const scheduleService = new ScheduleService();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const deleteBooking = async (data: BookedMeetingT) => {
    setIsLoading(true);
    let deletedBooking;

    try {
      deletedBooking = await scheduleService.delete_bookedMeeting(
        data.bookingId
      );

      queryClient.invalidateQueries();

      enqueueSnackbar(successfulDeleteBookingSnackbarMessage, {
        variant: 'success',
      });
    } catch (error: any) {
      deletedBooking = {
        error:
          'An error occured while deleting the building. Please try again.',
      };
      if (error instanceof AxiosError && error.response !== undefined) {
        if (error.response.status === 401) {
          enqueueSnackbar(errorUnauthorisedAccess, { variant: 'error' });
        } else {
          enqueueSnackbar(
            `${error.response.status}: ${errorDeleteBookingSnackbarMessage}`,
            { variant: 'error' }
          );
        }
      } else {
        // handle other errors
        enqueueSnackbar(
          `${errorDeleteBookingSnackbarMessage} ${error?.message ?? ''}`,
          { variant: 'error' }
        );
      }
    }
    await setTimeout(() => {}, 1000);
    setIsLoading(false);
    return deletedBooking;
  };
  return { isLoading, deleteBooking };
};

export default useBookingDelete;
