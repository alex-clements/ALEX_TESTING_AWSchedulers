import { BuildingT } from '../types/generaltypes';

export const buildings: BuildingT[] = [
  {
    id: '111',
    number: 1,
    name: 'AMAZON YVR11',
    airportCode: 'YVR',
    location: '202 Vancouver, BC',
    latitude: 100,
    longitude: 100,
    maxFloor: 15,
    isActive: true,
  },
  {
    id: '125',
    number: 2,
    name: 'AMAZON YVR19',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '124',
    number: 2,
    name: 'AMAZON YVR20',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '123',
    number: 2,
    name: 'AMAZON YVR21',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '126',
    number: 2,
    name: 'AMAZON YVR22',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '127',
    number: 2,
    name: 'AMAZON YVR23',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '128',
    number: 2,
    name: 'AMAZON YVR24',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '129',
    number: 2,
    name: 'AMAZON YVR27',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '130',
    number: 2,
    name: 'AMAZON YVR25',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '131',
    number: 2,
    name: 'AMAZON YVR26',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '132',
    number: 2,
    name: 'AMAZON YVR26',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '133',
    number: 2,
    name: 'AMAZON YVR26',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
  {
    id: '134',
    number: 2,
    name: 'AMAZON YVR26',
    airportCode: 'YVR',
    location: '211 Vancouver, BC',
    latitude: 120,
    longitude: 130,
    maxFloor: 25,
    isActive: true,
  },
];

export const blankBuilding: BuildingT = {
  id: '-1',
  number: 0,
  name: '',
  airportCode: '',
  location: '',
  latitude: 0,
  longitude: 0,
  maxFloor: 0,
  isActive: true,
};

const bl = buildings.find((b) => {
  return b.id === '111';
});
