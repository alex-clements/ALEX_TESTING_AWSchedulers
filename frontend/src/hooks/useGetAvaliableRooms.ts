import { useEffect, useState } from 'react';
import { useCreateMeeting } from '../features/CreateMeeting/context/useCreateMeetingContext';
import { RoomService } from '../services/room-service';
import { formatTimeIsoString } from '../utils/dateHelpers';
import { RoomAvailabilityT } from '../features/CreateMeeting/types/bookingOptions';
import { AxiosError } from 'axios';

export function useGetAvailableRooms(buildingId?: string) {
  const roomService = new RoomService();
  const { timeslot } = useCreateMeeting();
  const { timeStart, timeEnd } = timeslot;
  const startTime = formatTimeIsoString(timeStart);
  const endTime = formatTimeIsoString(timeEnd);
  const [rooms, setRooms] = useState<RoomAvailabilityT[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function getAvailableRooms(buildingId: string) {
    try {
      setIsLoading(true);
      setError('');
      const rooms = await roomService.post_availableRooms({
        buildingId,
        startTime,
        endTime,
      });
      setRooms(rooms || []);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.data?.error) {
          setError(error.response.data.error);
          return;
        }
      }
      setError(
        'An error occurred while fetching available rooms. Please try again!'
      );
    }
  }
  useEffect(() => {
    if (buildingId) {
      getAvailableRooms(buildingId);
    }
  }, [buildingId]);

  return { rooms, error, isLoading };
}
