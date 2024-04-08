import {
  DayAvailableHashT,
  TimeAvailableHashT,
  AvailableTimeT,
} from '../features/CreateMeeting/types';
import dayjs, { Dayjs } from 'dayjs';
import { formatTimeIsoString } from './dateHelpers';

// Function to create the time hash map
export const createTimeHashMap = (
  availableTimes: AvailableTimeT[]
): Promise<DayAvailableHashT> => {
  return new Promise((resolve, reject) => {
    try {
      const timeMap: DayAvailableHashT = {};

      // Helper function to generate time slots
      const generateTimeSlots = (start: string, end: string) => {
        const slots: TimeAvailableHashT = {};
        const dd1 = dayjs(start).format('YYYY-MM-DD-HH:mm:ss');
        const dd2 = dayjs(start).format('YYYY-MM-DD-HH:mm:ss');
        let current = roundToNearest5Minutes(dayjs(start));
        const day = current.format('ddd').toUpperCase();
        const endTime = roundToNearest5Minutes(dayjs(end));

        if (!timeMap[day]) {
          timeMap[day] = {};
        }

        while (current.isBefore(endTime)) {
          // Format time as a single-digit hour followed by minutes
          const timeKey = current.format('H:mm');
          timeMap[day][timeKey] = true;
          current = current.add(5, 'minute');
        }
      };

      // Generate time slots for each available time
      availableTimes.forEach((time) => {
        generateTimeSlots(time.startTime, time.endTime);
      });

      resolve(timeMap);
    } catch (error) {
      reject(error);
    }
  });
};

function roundToNearest5Minutes(date: Dayjs) {
  const minutes = date.minute();
  const rounding = 5;
  const roundedMinutes = Math.round(minutes / rounding) * rounding;
  return date.minute(roundedMinutes).second(0).millisecond(0);
}
