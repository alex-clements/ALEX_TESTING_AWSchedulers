import { RoomT } from '../types/generaltypes';
import { useQueryClient } from '@tanstack/react-query';
import { RoomService } from '../services/room-service';
import { enqueueSnackbar } from 'notistack';
import {
  errorEditRoomSnackbarMessage,
  errorUnauthorisedAccess,
  successfulEditRoomSnackbarMessage,
} from '../constants/snackbarMessages';
import { AxiosError } from 'axios';

const useRoomEdit = () => {
  const roomService = new RoomService();
  const queryClient = useQueryClient();

  const editRoom = async (id: string, data: RoomT) => {
    let roomData;
    try {
      const dataToSend: any = {
        capacity: data.capacity,
        floorNumber: data.floorNumber,
        roomNumber: data.roomNumber,
        roomName: data.roomName,
        AV: data.AV,
        VC: data.VC,
        isActive: data.isActive,
      };

      roomData = await roomService.put_room(id, dataToSend);
      queryClient.invalidateQueries();

      enqueueSnackbar(successfulEditRoomSnackbarMessage, {
        variant: 'success',
      });
    } catch (error) {
      roomData = {
        error: 'An error occured while editing the room. Please try again.',
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
          `${errorEditRoomSnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
      }
    }
    return roomData;
  };
  return { editRoom };
};

export default useRoomEdit;
