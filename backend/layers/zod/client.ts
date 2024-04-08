import { z } from 'zod';

export const handleError = (err: any) => {
  if (err.name.includes('Prisma')) {
    // from prisma
    return {
      error: 'Something went wrong. Please try again.',
      status: 500,
    };
  } else if (err.name.includes('ZodError')) {
    // err from zod
    if (err.errors[0].code === 'custom') {
      return {
        error: err.errors[0].message,
        status: 400,
      };
    }

    return {
      error: 'Invalid input data.',
      status: 400,
    };
  } else {
    // from others
    return {
      error: 'Something went wrong. Please try again',
      status: 500,
    };
  }
};

export const createUserSchema = z.object({
  username: z.string(),
  isAdmin: z.boolean().optional(),
  name: z.string(),
  floorNumber: z.number(),
  email: z.string().email({ message: 'Invaild email.' }).optional(),
  Building: z.string(),
  temporaryPassword: z
    .string()
    .refine(
      (val) => {
        const requirements = [
          { requirement: '8 characters or longer', regex: /^\S{8,}$/ },
          {
            requirement: 'one special character',
            regex: /[!@#$%^&*()\-_=+[\]{};:'"|<>,.?/]/,
          },
          { requirement: 'one lower case character', regex: /[a-z]+/ },
          { requirement: 'one upper case character', regex: /[A-Z]+/ },
          { requirement: 'one number', regex: /[0-9]+/ },
        ];
        return requirements.every((requirement) => requirement.regex.test(val));
      },
      { message: 'Password does not meet requirements.' }
    )
    .optional(),
});

export const updateUserSchema = z.object({
  username: z.string().optional(),
  isAdmin: z.boolean().optional(),
  name: z.string().optional(),
  floorNumber: z.number().optional(),
  Building: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createRoomSchema = z.object({
  roomNumber: z.string(),
  roomName: z.string().optional(),
  capacity: z.number(),
  floorNumber: z.number(),
  Building: z.string(),
  AV: z.boolean(),
  VC: z.boolean(),
});

export const updateRoomSchema = z.object({
  roomNumber: z.string().optional(),
  roomName: z.string().optional(),
  capacity: z.number().optional(),
  floorNumber: z.number().optional(),
  Building: z.string().optional(),
  AV: z.boolean().optional(),
  VC: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const createBuildingSchema = z.object({
  airportCode: z.string(),
  number: z.number(),
  maxFloor: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  location: z.string(),
});

export const updateBuildingSchema = z.object({
  airportCode: z.string().optional(),
  number: z.number().optional(),
  maxFloor: z.number().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
  activateAllRooms: z.boolean().optional(),
});

const checkTime = (time: string) => {
  return time.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/);
};

export const createBookingSchema = z.object({
  name: z.string(),
  startTime: z.string().refine(checkTime, {
    message: 'Invalid date format.',
  }),
  endTime: z.string().refine(checkTime, {
    message: 'Invalid date format.',
  }),
  organizer: z.string(),
  roomUser: z.array(
    z.object({
      id: z.string(),
      users: z.array(z.string()),
    })
  ),
});

// export const updateBookingSchema = z.object({
//   name: z.string().optional(),
//   startTime: z
//     .string()
//     .refine(checkTime, {
//       message: 'Invalid date format - booking schema validator ',
//     })
//     .optional(),
//   endTime: z
//     .string()
//     .refine(checkTime, {
//       message: 'Invalid date format - booking schema validator',
//     })
//     .optional(),
//   organizer: z.string().optional(),
//   id: z.string().optional(),
//   users: z.array(z.string()).optional(),
// });

export const recordSchema = z.object({
  userId: z.string(),
  bookingId: z.string(),
  id: z.string(),
});

export const getAvailabilityRequest = z.object({
  users: z.array(z.string()),
  startDay: z.string().refine(checkTime, {
    message: 'Invalid date format.',
  }),
  currentDay: z.string().refine(checkTime, {
    message: 'Invalid date format.',
  }),
});

export const getAvailableRoomsRequest = z.object({
  buildingId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const findBookingRequest = z.object({
  startTime: z.string().refine(checkTime, {
    message: 'Invalid date format.',
  }),
  endTime: z.string().refine(checkTime, {
    message: 'Invalid date format.',
  }),
  users: z.array(z.string()),
  AV: z.boolean(),
  VC: z.boolean(),
  replaceMeeting: z.boolean(),
  singleRoom: z.boolean().optional()
});
