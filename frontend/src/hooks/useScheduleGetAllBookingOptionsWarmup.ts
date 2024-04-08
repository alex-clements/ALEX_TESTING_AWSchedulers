import { useQuery } from '@tanstack/react-query';
import { ScheduleService } from '../services/schedule-service';
import {
  BookingOptionsRequestT,
  BookingOptionsResponseT,
} from '../features/CreateMeeting/types/bookingOptions';

export const useScheduleGetAllBookingOptionsWarmup = () => {
  const getBookingOptionsWarmup = async () => {
    const scheduleService = new ScheduleService();
    let scheduleData: BookingOptionsResponseT;
    try {
      // @ts-ignore
      scheduleData = await scheduleService.post_getBookingOptions({});
      return scheduleData.recommendations;
    } catch (error) {
      return [];
    }
  };
  return { getBookingOptionsWarmup };
};
