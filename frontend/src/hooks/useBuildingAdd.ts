import { BuildingT } from '../types/generaltypes';
import { BuildingService } from '../services/building-service';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { errorEditBuildingSnackbarMessage, errorUnauthorisedAccess, successfulAddBuildingSnackbarMessage } from '../constants/snackbarMessages';
import { AxiosError } from 'axios';

const useBuildingAdd = () => {
  const buildingService = new BuildingService();
  const queryClient = useQueryClient();

  const addBuilding = async (data: BuildingT) => {
    let buildingData;
    try {
      buildingData = await buildingService.post_building(data);
      queryClient.invalidateQueries();
      console.log(JSON.stringify(buildingData, Object.getOwnPropertyNames(buildingData)));
      // enqueueSnackbar(successfulAddBuildingSnackbarMessage, {variant: 'success'});
      enqueueSnackbar(`${successfulAddBuildingSnackbarMessage}`, {variant: 'success'});
    } catch (error) {
      buildingData = {
        error: 'An error occured while adding the building. Please try again.',
      };
      if (error instanceof AxiosError && error.response !== undefined) {
        if (error.response.status === 401) {
          enqueueSnackbar(errorUnauthorisedAccess, {variant: 'error'});
        } else {
          enqueueSnackbar(`${error.response.status}: ${error.response.data.error}`, {variant: 'error'});
        }
      } else { // handle other errors
        enqueueSnackbar(`${errorEditBuildingSnackbarMessage} ${(error as any)? (error as any).message : ""}`, {variant: 'error'});   
      }
    }
    return buildingData;
  };
  return { addBuilding };
};

export default useBuildingAdd;
