import { UserT } from '../types/generaltypes';

export const users: UserT[] = [
  {
    id: '1',
    username: 'John',
    name: 'Doe',
    email: 'johndoe@example.com',
    Building: '0',
    floorNumber: 1,
    isAdmin: true,
    isActive: true,
  },
];

export const blankUser: UserT = {
  id: '',
  username: '',
  name: '',
  email: '',
  Building: '',
  floorNumber: 0,
  isAdmin: false,
  isActive: true,
};
