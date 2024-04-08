import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export const getRelevantMonday = (chosenDate?: string) => {
  // If no date is provided, use today's date
  let chosenDateDayJs;
  if (chosenDate !== undefined) {
    chosenDateDayJs = dayjs(chosenDate);
  } else {
    chosenDateDayJs = dayjs();
  }

  const dayOfWeek = chosenDateDayJs.day(); // day() returns the day of the week, where Sunday is 0 and Saturday is 6

  if (dayOfWeek === 0) {
    // If chosenDate is Sunday
    return chosenDateDayJs.add(1, 'day').format('YYYY-MM-DD'); // Next day is Monday
  } else if (dayOfWeek === 6) {
    // If chosenDate is Saturday
    return chosenDateDayJs.add(2, 'day').format('YYYY-MM-DD'); // Next Monday is in 2 days
  } else {
    // If chosenDate is between Friday and Monday (inclusive)
    return chosenDateDayJs.subtract(dayOfWeek - 1, 'day').format('YYYY-MM-DD'); // Calculate the current week's Monday
  }
};

export const getNextFiveDays = (startDate: string) => {
  const nextFiveDays = [];
  const start = dayjs(getRelevantMonday(startDate));

  for (let i = 1; i <= 5; i++) {
    // Add the day number to the array
    nextFiveDays.push(start.add(i, 'day').date());
  }

  return nextFiveDays;
};

export const getMonToFriDateFormatted = (startDate: string) => {
  const formattedDays = { MON: '', TUE: '', WED: '', THU: '', FRI: '' };
  const start = dayjs(getRelevantMonday(startDate));

  for (let i = 0; i < 5; i++) {
    const nextDay = start.add(i, 'day');
    const dayName = nextDay.format('ddd').toUpperCase(); // Gets the day name and converts to uppercase
    // @ts-ignore
    formattedDays[dayName] = nextDay.format(`YYYY-MM-DDTHH:mm:ssZ`);
  }

  return formattedDays;
};

export const formatTimeIsoString = (date: string | Date) => {
  // format in iso format
  return new Date(date).toISOString();
};

export const formatTo6AM = (date: string) => {
  return dayjs(date).startOf('day').add(6, 'hour').toISOString();
};
// export const formatTimeIsoString = (date: string | Date) => {
//   dayjs.extend(utc);
//   // @ts-ignore
//   var dateConvertedToLocal = dayjs(date).utcDate.format();
//   return dateConvertedToLocal;
// };
export const isTimeGreaterThan = (time1: string, time2: string) => {
  // Create dayjs objects from the times
  const dt1 = dayjs(time1, 'HH:mm');
  const dt2 = dayjs(time2, 'HH:mm');

  // Compare the two times
  return dt1.isAfter(dt2);
};
