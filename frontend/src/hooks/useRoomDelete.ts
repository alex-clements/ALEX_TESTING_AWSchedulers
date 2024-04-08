import { RoomT } from '../types/generaltypes';
import { useQueryClient } from '@tanstack/react-query';
import { RoomService } from '../services/room-service';
import { enqueueSnackbar } from 'notistack';
import {
  errorDeleteRoomSnackbarMessage,
  errorUnauthorisedAccess,
  successfulDeleteRoomSnackbarMessage,
} from '../constants/snackbarMessages';
import { AxiosError } from 'axios';

const useRoomDelete = () => {
  const roomService = new RoomService();
  const queryClient = useQueryClient();

  const deleteRoom = async (data: RoomT) => {
    let roomData;
    try {
      roomData = await roomService.delete_room(data);
      queryClient.invalidateQueries();

      enqueueSnackbar(successfulDeleteRoomSnackbarMessage, {
        variant: 'success',
      });
    } catch (error) {
      roomData = {
        error: 'An error occured while deleting the room. Please try again.',
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
          `${errorDeleteRoomSnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
      }
    }
    return roomData;
  };
  return { deleteRoom };
};

export default useRoomDelete;
