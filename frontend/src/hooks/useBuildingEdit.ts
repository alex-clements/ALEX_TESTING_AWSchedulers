import { BuildingT } from "../types/generaltypes";
import { BuildingService } from '../services/building-service';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from "notistack";
import { errorEditBuildingSnackbarMessage, errorUnauthorisedAccess, successfulEditBuildingSnackbarMessage } from "../constants/snackbarMessages";
import { AxiosError } from "axios";

const useBuildingEdit = () => {
    const buildingService = new BuildingService();
    const queryClient = useQueryClient();
    const editBuilding = async (id: string, data: BuildingT) => {
        let buildingData; 
        try {
            buildingData = await buildingService.put_building(id, data);
            queryClient.invalidateQueries();

            enqueueSnackbar(successfulEditBuildingSnackbarMessage, {variant: 'success'});
        } catch (error: any) {
            buildingData = {error: "An error occured while editing the building. Please try again."};
            if (error instanceof AxiosError && error.response !== undefined) {
                if (error.response.status === 401) {
                  enqueueSnackbar(errorUnauthorisedAccess, {variant: 'error'});
                } else {
                  enqueueSnackbar(`${error.response.status}: ${error.response.data.error}`, {variant: 'error'});
                }
            } else { // handle other errors
                enqueueSnackbar(`${errorEditBuildingSnackbarMessage} ${error ? error.message : ""}`, {variant: 'error'});   
            }
        }
        return buildingData;
    }
    return {editBuilding}
}

export default useBuildingEdit;