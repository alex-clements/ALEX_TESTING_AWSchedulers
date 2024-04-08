import { RoomT } from '../types/generaltypes';
import { useQueryClient } from '@tanstack/react-query';
import {
  ScheduleService,
  get_bookedMeetingsRoute,
} from '../services/schedule-service';
// @ts-ignore
import { RecommendationT } from '../features/CreateMeeting/types/bookingOptions';
import {
  errorScheduleAddBookingSnackbarMessage,
  errorUnauthorisedAccess,
  successfulScheduleAddBookingSnackbarMessage,
} from '../constants/snackbarMessages';
import { enqueueSnackbar } from 'notistack';
import { AxiosError } from 'axios';
import { formatTimeIsoString } from '../utils/dateHelpers';
import { useCreateMeeting } from '../features/CreateMeeting/context/useCreateMeetingContext';
import { useState } from 'react';
import { set } from 'react-hook-form';

interface AddBookingInterface {
  title: string;
  description: string;
}

const useScheduleAddBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const scheduleService = new ScheduleService();
  const queryClient = useQueryClient();
  const {
    timeslot: { timeStart, timeEnd },
    rescheduledBooking: { bookingId: bookingIdToBeReplaced },
    bookingInformation: bookingOption,
  } = useCreateMeeting();

  const addBooking = async ({ title, description }: AddBookingInterface) => {
    setIsLoading(true);
    let newBooking = { error: '' };
    try {
      // If rescheduling a booking, delete the old booking
      if (bookingIdToBeReplaced !== null) {
        await scheduleService.delete_bookedMeeting(bookingIdToBeReplaced);
      }
      if (bookingOption === null) {
        throw new Error('No booking option selected');
      }
      const roomUser = bookingOptionExtractInformation(bookingOption);
      const data: BookMeetingRequestT = {
        startTime: formatTimeIsoString(timeStart),
        endTime: formatTimeIsoString(timeEnd),
        name: title,
        organizer: '',
        roomUser,
      };

      await scheduleService.post_bookMeeting(data);
      queryClient.invalidateQueries();

      enqueueSnackbar(successfulScheduleAddBookingSnackbarMessage, {
        variant: 'success',
      });
    } catch (error) {
      newBooking = {
        error: 'An error occured while adding the room. Please try again.',
      };
      if (error instanceof AxiosError && error.response !== undefined) {
        enqueueSnackbar(
          `${error.response.status}: ${errorScheduleAddBookingSnackbarMessage}`,
          { variant: 'error' }
        );
      } else {
        // handle other errors
        enqueueSnackbar(
          `${errorScheduleAddBookingSnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
        newBooking = {
          error: 'An error occured while adding the room. Please try again.',
        };
      }
      setIsLoading(false);
      return newBooking;
    }
  };
  return { isLoading, addBooking };
};

export default useScheduleAddBooking;

const bookingOptionExtractInformation = (bookingOption: RecommendationT) => {
  const rooms = bookingOption.rooms;
  const roomUser = rooms.map((room) => {
    return {
      id: room.id,
      users: room.attendees.map((attendee) => attendee.id),
    };
  });
  return roomUser;
};
