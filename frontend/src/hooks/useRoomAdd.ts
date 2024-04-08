import { RoomT } from '../types/generaltypes';
import { useQueryClient } from '@tanstack/react-query';
import { RoomService } from '../services/room-service';
import { enqueueSnackbar } from 'notistack';
import {
  errorAddRoomSnackbarMessage,
  errorUnauthorisedAccess,
  successfulAddRoomSnackbarMessage,
} from '../constants/snackbarMessages';
import { AxiosError } from 'axios';

const useRoomAdd = () => {
  const roomService = new RoomService();
  const queryClient = useQueryClient();

  const addRoom = async (data: RoomT) => {
    let roomData;
    try {
      roomData = await roomService.post_room(data);
      queryClient.invalidateQueries();

      enqueueSnackbar(successfulAddRoomSnackbarMessage, { variant: 'success' });
    } catch (error) {
      roomData = {
        error: 'An error occured while adding the room. Please try again.',
      };
      if (error instanceof AxiosError && error.response !== undefined) {
        if (error.response.status === 401) {
          enqueueSnackbar(errorUnauthorisedAccess, { variant: 'error' });
        } else {
          enqueueSnackbar(
            `${error.response.status}: ${error.response.data.error}`,
            { variant: 'error' }
          );
        }
      } else {
        // handle other errors
        enqueueSnackbar(
          `${errorAddRoomSnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
      }
    }
    return roomData;
  };
  return { addRoom };
};

export default useRoomAdd;
