import { BuildingT } from '../types/generaltypes';
import { BuildingService } from '../services/building-service';
import { useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import {
  errorDeleteBuildingSnackbarMessage,
  errorUnauthorisedAccess,
  successfulDeleteBuildingSnackbarMessage,
} from '../constants/snackbarMessages';
import { AxiosError } from 'axios';

const useBuildingDelete = () => {
  const buildingService = new BuildingService();
  const queryClient = useQueryClient();

  const deleteBuilding = async (data: BuildingT) => {
    let buildingDelete;
    try {
      buildingDelete = await buildingService.delete_building(data);
      // console.log('buildingData', buildingData.data);
      console.log('buildingData', buildingDelete);
      queryClient.invalidateQueries();

      enqueueSnackbar(successfulDeleteBuildingSnackbarMessage, {
        variant: 'success',
      });
    } catch (error) {
      buildingDelete = {
        error:
          'An error occured while deleting the building. Please try again.',
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
          `${errorDeleteBuildingSnackbarMessage} ${
            (error as any) ? (error as any).message : ''
          }`,
          { variant: 'error' }
        );
      }
    }
    return buildingDelete;
  };
  return { deleteBuilding };
};

export default useBuildingDelete;
