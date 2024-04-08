import { useQuery } from '@tanstack/react-query';
import { RoomService } from '../services/room-service';
import { RoomT } from '../types/generaltypes';
import { get_roomByBuildingIdRoute } from '../routing/routes';

export const userRoomGetActiveByBuildingId = ({
  buildingId,
}: {
  buildingId: string;
}) => {
  const roomService = new RoomService();
  // prettier-ignore
  let { isLoading: isLoadingRooms, data, error: isErrorLoadingRooms,
  } = useQuery({
    queryKey: [get_roomByBuildingIdRoute(buildingId)],
    queryFn: () => roomService.get_roomsByBuildingId(buildingId),
  });

  const processedData = data?.result || data || [];

  // prettier-ignore
  let rooms: RoomT[] = processedData.map((room: RoomT) => {
    const r:RoomT = {
      id: room.id, 
      roomNumber: room.roomNumber, 
      roomName: room.roomName, 
      Building: buildingId, 
      floorNumber: room.floorNumber, 
      capacity: room.capacity, 
      AV: room.AV, 
      VC: room.VC,
      isActive: room.isActive,
    };
    return r;
    // const {id, roomNumber, roomName, Building, floorNumber, capacity, AV, VC} = room;
    // const buildingId = Building
    // return {id, roomNumber, roomName, buildingId, floorNumber, capacity, AV, VC};
  });
  rooms = rooms.filter((room) => room.isActive);
  return {
    isLoadingRooms,
    rooms,
    isErrorLoadingRooms,
  };
};
