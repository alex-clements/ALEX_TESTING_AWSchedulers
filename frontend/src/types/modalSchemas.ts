import { z } from 'zod';
import { UserT } from './generaltypes';

const minUsernameLength: number = 8;
const maxUsernameLength: number = 128;
const maxStringInput: number = 255;
const maxEmailLength: number = 320;

// const verifyLatitude = (value: string) => {
//     const num = parseFloat(value);
//     return (isNaN(num) && (-90 <= num) && (num <= 90));
// }

function checkPasswordRequirements(value: string, ctx: z.RefinementCtx) {
  if (!value) return true;

  const passwordRequirements = [
    {
      requirement: 'Password must not have leading or trailing spaces',
      test: (value: string) => value === value.trim(),
    },
    {
      requirement: 'Password must be 8 characters or longer',
      regex: /^.{8,}$/,
    },
    {
      requirement: 'Password must contain one special character',
      regex: /[!@#$%^&*()\-_=+[\]{};:'"|<>,.?/]/,
    },
    {
      requirement: 'Password must have one lower case character',
      regex: /[a-z]+/,
    },
    {
      requirement: 'Password must have one upper case character',
      regex: /[A-Z]+/,
    },
    { requirement: 'Password must have one number', regex: /[0-9]+/ },
  ];

  for (const requirement of passwordRequirements) {
    if ('regex' in requirement) {
      if (requirement.regex && !requirement.regex.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requirement.requirement,
        });
      }
    } else if ('test' in requirement) {
      if (requirement.test && !requirement.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: requirement.requirement,
        });
      }
    }
  }
}

export const getAddUserModalSchema = (maxFloor: number, userPool: UserT[]) => {
  return z.object({
    id: z.string(),
    username: z
      .string()
      .min(
        minUsernameLength,
        `Username must be at least ${minUsernameLength} characters.`
      )
      .max(
        maxUsernameLength,
        `Username must be less ${maxUsernameLength} than  characters.`
      )
      .refine(
        (value: string) =>
          !userPool.some((user: UserT) => user?.username === value),
        {
          message: 'Username is taken. Please choose another.',
        }
      )
      .refine((val) => {
        // username can not contain spaces
        const noSpacesRegex = /^\S*$/;
        return noSpacesRegex.test(val);
      }, 'Username can not contain spaces'),
    name: z.string().min(1, 'Name required.').max(maxStringInput, `Name must be fewer than ${maxStringInput} characters.`),
    email: z.string().email()
                    .max(maxEmailLength, `Email can be at most ${maxEmailLength} characters.`)
                    .refine((value: string) => !userPool.some((user: UserT) => user?.email === value), {
                        message: "Email is already associated with another user."
                    }),
    Building: z.string().min(1, 'Building required.'),
    floorNumber: z
      .number()
      .min(1, 'Floor must be greater than 0.')
      .max(maxFloor, 'Please select valid floor.'),
    isAdmin: z.boolean().optional(),
    temporaryPassword: z
      .string()
      .superRefine(checkPasswordRequirements)
      .optional(),
  });
};

export const getEditUserModalSchema = (maxFloor: number) => {
    return z.object({
        id: z.string(),
        name: z.string().min(1, "Name required.").max(maxStringInput, `Name must be fewer than ${maxStringInput} characters.`),
        email: z.string().email().max(maxEmailLength, `Email can be at most ${maxEmailLength} characters.`),
        Building: z.string().min(1, "Building required."),
        floorNumber: z.number().min(1, "Floor must be greater than 0.").max(maxFloor, "Please select valid floor."),
        isAdmin: z.boolean().optional(),
    });
};

export const getRoomModalSchema = (maxFloor: number) => {
    return z.object({
        id: z.string(),
        roomName: z.string().max(maxStringInput, `Name must be fewer than ${maxStringInput} characters.`).optional(),
        roomNumber: z.string().min(1, "Room Number required.").max(5, "Room Number must be less than 6 digits.")
                    .regex(/^[0-9A-Za-z]{1,5}$/, "Must contain only alphanumeric characters"),
        // Building: z.string().min(1, "Building required."),
        floorNumber: z.number().min(1, "Floor must be greater than 0.").max(maxFloor, "Please select valid floor."),
        capacity: z.number().min(1, "Enter a capacity greater than 0.").max(8000, "Capacity too high (8000 max)."),
        AV: z.boolean(),
        VC: z.boolean(),
    });
};

export const buildingModalSchema = z.object({
    id: z.string(),
    number: z.number().min(1, "Building number required.").max(9999, "Building number must be less than 6 digits."),
    airportCode: z.string().length(3, "Must be 3 alphabetical characters. E.g., ABC.").regex(/^[A-Za-z]{3}$/, "Must contain only alphabetical characters"),
    location: z.string().min(1, "Building location required.").max(maxStringInput, `Address field must be fewer than ${maxStringInput} characters.`),
    latitude: z.number().min(-90, "Min latitude is -90.").max(90, "Max latitude is 90."),
    // latitude: z.string().min(1, "Latitude required.")
    //                     .refine((value: string) => {
    //                         const num = parseFloat(value);
    //                         return (isNaN(num) && (-90 <= num) && (num <= 90));
    //                     }, {
    //                         message: "Latitude must be between -90 and 90."
    //                     }),
    longitude: z.number().min(-180, "Min longitude is -180.").max(180, "Max longitude is 180."),
    maxFloor: z.number().min(1, "Floor count must be greater than 0.").max(163, "Floor count must be less than 164."),
});
