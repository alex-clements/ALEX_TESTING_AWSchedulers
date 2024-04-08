export const userAvailability = [
  {
    day: 'MON',
    timeslots: [
      {
        start: '9:00',
        end: '10:00',
        startNumber: 5, // This field is used in the css for timeslots
        endtNumber: 7,
      },
      {
        start: '12:00',
        end: '13:00',
        startNumber: 11,
        endNumber: 13,
      },
    ],
  },
];
// Start Number and end Number are used to calculate the location of the timeslot in the css
// If the data come preprocessed with these numbers it will be faster on the frontend
// I can change the schema of this numbering system but it is alot faster to compare numbers
// eg. 7:00 == 1
//     7:30 == 2
//     8:00 == 3
//     8:30 == 4
//     9:00 == 5
//     9:30 == 6
//     10:00 == 7
//     10:30 == 8
//     11:00 == 9
//     11:30 == 10
//     12:00 == 11
//     12:30 == 12
//     13:00 == 13 ...
