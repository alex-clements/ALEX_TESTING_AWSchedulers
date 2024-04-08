import { enqueueSnackbar } from 'notistack';
import { UserService } from '../services/user-service';
import { UserT } from '../types/generaltypes';
import { useQueryClient } from '@tanstack/react-query';
import {
  errorAddUserSnackbarMessage,
  errorUnauthorisedAccess,
  successfulAddUserSnackbarMessage,
} from '../constants/snackbarMessages';
import { AxiosError } from 'axios';

const useUserAdd = () => {
  const userService = new UserService();
  const queryClient = useQueryClient();

  const addUser = async (data: UserT) => {
    let userData;
    try {
      const dataToSend = {
        name: data.name,
        username: data.username,
        email: data.email,
        Building: data.Building,
        floorNumber: data.floorNumber,
        isAdmin: data.isAdmin,
        ...(data.temporaryPassword && {
          temporaryPassword: data.temporaryPassword,
        }),
      };
      userData = await userService.post_user(dataToSend);
      queryClient.invalidateQueries();

      enqueueSnackbar(successfulAddUserSnackbarMessage, { variant: 'success' });
    } catch (error) {
      userData = {
        error: 'An error occured while adding the user. Please try again.',
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
          `${errorAddUserSnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
      }
    }
    return userData;
  };
  return { addUser };
};

export default useUserAdd;
