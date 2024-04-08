// import { enqueueSnackbar } from 'notistack';
// import { UserService } from '../services/user-service';
// import { UserT } from '../types/generaltypes';
// import { useQueryClient } from '@tanstack/react-query';
// import { errorDisableUserSnackbarMessage, errorUnauthorisedAccess, successfulDisableUserSnackbarMessage } from '../constants/snackbarMessages';
// import { AxiosError } from 'axios';

// const useUserDelete = () => {
//   const userService = new UserService();
//   const queryClient = useQueryClient();

//   const deleteUser = async (data: UserT) => {
//     let userData;
//     try {
//       userData = await userService.delete_user(data);
//       // console.log('userData', userData.data);
//       console.log('userData', userData);
//       queryClient.invalidateQueries();

//       enqueueSnackbar(successfulDisableUserSnackbarMessage, {variant: 'success'});
//     } catch (error) {
//       userData = {
//         error: 'An error occured while deleting the user. Please try again.',
//       };
//       if (error instanceof AxiosError && error.response !== undefined) {
//         if (error.response.status === 401) {
//           enqueueSnackbar(errorUnauthorisedAccess, {variant: 'error'});
//         } else {
//           enqueueSnackbar(`${error.response.status}: ${errorDisableUserSnackbarMessage}`, {variant: 'error'});
//         }
//       } else { // handle other errors
//         enqueueSnackbar(`${errorDisableUserSnackbarMessage} ${(error as any)? (error as any).message : ""}`, {variant: 'error'});   
//       }
//     }
//     return userData;
//   };
//   return { deleteUser };
// };

// export default useUserDelete;
