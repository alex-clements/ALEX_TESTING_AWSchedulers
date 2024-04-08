import { useQuery } from '@tanstack/react-query';
import { BuildingService, buildingsRoute } from '../services/building-service';
import { BuildingT } from '../types/generaltypes';
import { useMemo } from 'react';

export const useBuildingGetAll = () => {
  const buildingService = new BuildingService();

  const { isLoading, data, error } = useQuery({
    queryKey: [buildingsRoute],
    queryFn: () => buildingService.get_buildings(),
  });

  // prettier-ignore
  const buildings: BuildingT[] = useMemo(() => {
    const processedData = data || [];
    return processedData.map((building: BuildingT) => {
    const {id,number,airportCode,location,latitude,longitude,maxFloor,isActive} = building;

    const name = airportCode + " " + number

    return {id,number,name,airportCode,location,latitude,longitude,maxFloor,isActive};
    })
  },[data]);

  return { isLoading, buildings, error };
};
