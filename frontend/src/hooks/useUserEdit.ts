import { enqueueSnackbar } from "notistack";
import { UserService } from "../services/user-service";
import { UserT } from "../types/generaltypes";
import { useQueryClient } from '@tanstack/react-query';
import { errorEditUserSnackbarMessage, errorUnauthorisedAccess, successfulEditUserSnackbarMessage } from "../constants/snackbarMessages";
import { AxiosError } from "axios";


const useUserEdit = () => {
    const userService = new UserService();
    const queryClient = useQueryClient();

    const editUser = async (id: string, data: UserT) => {
        let userData; 
        try {
            const dataToSend = {
                id: data.id,
                name: data.name,
                email: data.email,
                Building: data.Building,
                floorNumber: data.floorNumber,
                isAdmin: data.isAdmin,
                isActive: data.isActive
            }
            userData = await userService.put_user(data.id, dataToSend);
            queryClient.invalidateQueries();
            
            enqueueSnackbar(successfulEditUserSnackbarMessage, {variant: 'success'});
        } catch (error) {
            userData = {error: "An error occured while editing the user. Please try again."};
            if (error instanceof AxiosError && error.response !== undefined) {
                if (error.response.status === 401) {
                    enqueueSnackbar(errorUnauthorisedAccess, {variant: 'error'});
                } else {
                    enqueueSnackbar(`${error.response.status}: ${error.response.data.error}`, {variant: 'error'});
                }
            } else { // handle other errors
                enqueueSnackbar(`${errorEditUserSnackbarMessage} ${(error as any)? (error as any).message : ""}`, {variant: 'error'});   
            }
        }
        return userData;
    }
    return {editUser}
}

export default useUserEdit;