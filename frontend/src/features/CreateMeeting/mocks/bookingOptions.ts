import {
  BookingOptionsResponseT,
  BookingOptionsRequestT,
} from '../types/bookingOptions';

export const requestBookingOptions: BookingOptionsRequestT = {
  users: ['1', '2', '3', '4', '5'],
  AV: true,
  VC: true,
  singleRoom: false,
  startTime: '2024-01-31T09:00:00Z',
  endTime: '2024-01-31T10:00:00Z',
  replaceMeeting: false,
};

export const responseBookingOptions: BookingOptionsResponseT = {
  participants: [
    {
      id: 'clucz7d1m009vzhqfl1cb7h9d',
      name: 'Booking User1',
    },
    {
      id: 'clucz7d1m009wzhqf9w9b6uga',
      name: 'Booking User2',
    },
    {
      id: 'clucz7d1m009yzhqf8c5qjkhh',
      name: 'Booking User4',
    },
  ],
  recommendations: [
    {
      recommendationId: 0,
      rooms: [
        {
          id: 'clucz7ch2000izhqffy0wycwp',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '1',
          roomName: 'Interview',
          floorNumber: 4,
          capacity: 4,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 1,
      rooms: [
        {
          id: 'clucz7ch2000jzhqf5azljxj7',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '101',
          roomName: 'Interview',
          floorNumber: 4,
          capacity: 4,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 2,
      rooms: [
        {
          id: 'clucz7ch2000czhqfvb95pjit',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '101',
          roomName: 'Chickadee',
          floorNumber: 3,
          capacity: 4,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 3,
      rooms: [
        {
          id: 'clucz7ch2000nzhqfx5ev5kbi',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '101',
          roomName: 'Sockeye',
          floorNumber: 5,
          capacity: 4,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 4,
      rooms: [
        {
          id: 'clucz7ch2000gzhqfvjn3xaci',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '405',
          roomName: 'Kinglet Casual',
          floorNumber: 3,
          capacity: 5,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 5,
      rooms: [
        {
          id: 'clucz7ch2000szhqfykzqs3ih',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '405',
          roomName: 'Steelhead Casual',
          floorNumber: 5,
          capacity: 5,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 6,
      rooms: [
        {
          id: 'clucz7ch20006zhqfv15k20f3',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '101',
          roomName: 'Yaletown',
          floorNumber: 2,
          capacity: 4,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 7,
      rooms: [
        {
          id: 'clucz7ch2000uzhqfuey9u1ea',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '101',
          roomName: 'Okanagan',
          floorNumber: 6,
          capacity: 4,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 8,
      rooms: [
        {
          id: 'clucz7ch2000dzhqfq0s1wh1e',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '102',
          roomName: 'Reservoir',
          floorNumber: 3,
          capacity: 6,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 9,
      rooms: [
        {
          id: 'clucz7ch2000ozhqfn9mdpij0',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '102',
          roomName: 'Coho',
          floorNumber: 5,
          capacity: 6,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 10,
      rooms: [
        {
          id: 'clucz7ch20004zhqf1ne82782',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '405',
          roomName: 'Earles Casual',
          floorNumber: 1,
          capacity: 4,
          AV: false,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 11,
      rooms: [
        {
          id: 'clucz7ch20013zhqf8cirx6ua',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '404',
          roomName: 'Kermode',
          floorNumber: 7,
          capacity: 4,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 12,
      rooms: [
        {
          id: 'clucz7ch20014zhqfdhmhrms6',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '405',
          roomName: 'Orca',
          floorNumber: 7,
          capacity: 4,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 13,
      rooms: [
        {
          id: 'clucz7ch2000azhqfcbecclxp',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '405',
          roomName: 'Grandview Casual',
          floorNumber: 2,
          capacity: 5,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 14,
      rooms: [
        {
          id: 'clucz7ch2000zzhqfnbdt32wx',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '405',
          roomName: 'Sprott Casual',
          floorNumber: 6,
          capacity: 5,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 15,
      rooms: [
        {
          id: 'clucz7ch20015zhqfy5jvizqo',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '406',
          roomName: 'Moose Casual',
          floorNumber: 7,
          capacity: 5,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 16,
      rooms: [
        {
          id: 'clucz7ch20007zhqffuzl8z70',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '102',
          roomName: 'Kerrisdale',
          floorNumber: 2,
          capacity: 6,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 17,
      rooms: [
        {
          id: 'clucz7ch2000vzhqfnkyirgv7',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '102',
          roomName: 'Buntzen',
          floorNumber: 6,
          capacity: 6,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 18,
      rooms: [
        {
          id: 'clucz7ch20002zhqfwxi9arhg',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '102',
          roomName: 'Trafalgar',
          floorNumber: 1,
          capacity: 6,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 19,
      rooms: [
        {
          id: 'clucz7ch2000hzhqfgv5f95lg',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '406',
          roomName: 'Ravine',
          floorNumber: 3,
          capacity: 10,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 20,
      rooms: [
        {
          id: 'clucz7ch2000tzhqftcqktioa',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '406',
          roomName: 'Kokanee',
          floorNumber: 5,
          capacity: 10,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 21,
      rooms: [
        {
          id: 'clucz7ch20005zhqf6hh5wln0',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '406',
          roomName: 'Riley',
          floorNumber: 1,
          capacity: 8,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 22,
      rooms: [
        {
          id: 'clucz7ch2000bzhqfs3dydiav',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '406',
          roomName: 'Marpole',
          floorNumber: 2,
          capacity: 10,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 23,
      rooms: [
        {
          id: 'clucz7ch20010zhqfnastpdk1',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '406',
          roomName: 'Kootenay',
          floorNumber: 6,
          capacity: 10,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 24,
      rooms: [
        {
          id: 'clucz7ch2000qzhqf88m0hg85',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '403',
          roomName: '',
          floorNumber: 5,
          capacity: 14,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 25,
      rooms: [
        {
          id: 'clucz7ch20011zhqfpiwmw5yw',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '1',
          roomName: 'Eagle',
          floorNumber: 7,
          capacity: 10,
          AV: false,
          VC: false,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 26,
      rooms: [
        {
          id: 'clucz7ch2000ezhqfgp4ghlla',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '103',
          roomName: 'Thompson',
          floorNumber: 3,
          capacity: 16,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 27,
      rooms: [
        {
          id: 'clucz7ch2000pzhqfxabhgq4j',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '103',
          roomName: 'Chinook',
          floorNumber: 5,
          capacity: 16,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 28,
      rooms: [
        {
          id: 'clucz7ch2000xzhqf5j4xbinn',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '403',
          roomName: 'Babine',
          floorNumber: 6,
          capacity: 14,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 29,
      rooms: [
        {
          id: 'clucz7ch20016zhqf8bkiceuz',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '407',
          roomName: 'Raccoon',
          floorNumber: 7,
          capacity: 12,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 30,
      rooms: [
        {
          id: 'clucz7ch2000fzhqf5gp6n2i1',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '404',
          roomName: 'Brockton',
          floorNumber: 3,
          capacity: 18,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 31,
      rooms: [
        {
          id: 'clucz7ch2000rzhqf3yy6tna9',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '404',
          roomName: 'Char',
          floorNumber: 5,
          capacity: 18,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 32,
      rooms: [
        {
          id: 'clucz7ch2000mzhqfw73n37mj',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '3',
          roomName: 'Jericho',
          floorNumber: 4,
          capacity: 26,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 33,
      rooms: [
        {
          id: 'clucz7ch20008zhqfnqyvx3ha',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '103',
          roomName: 'Gastown',
          floorNumber: 2,
          capacity: 16,
          AV: false,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 34,
      rooms: [
        {
          id: 'clucz7ch2000wzhqf5iigl24c',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '103',
          roomName: 'Elfin',
          floorNumber: 6,
          capacity: 16,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 35,
      rooms: [
        {
          id: 'clucz7ch20009zhqfy2kd3k9m',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '404',
          roomName: 'Killarney',
          floorNumber: 2,
          capacity: 18,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 36,
      rooms: [
        {
          id: 'clucz7ch2000yzhqfh417x5tc',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '404',
          roomName: 'Ootsa',
          floorNumber: 6,
          capacity: 18,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 37,
      rooms: [
        {
          id: 'clucz7ch20003zhqfgw6e5qoq',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '404',
          roomName: 'Lighthouse',
          floorNumber: 1,
          capacity: 18,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 38,
      rooms: [
        {
          id: 'clucz7ch20012zhqf0ccpt0ts',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '101',
          roomName: 'Lynx',
          floorNumber: 7,
          capacity: 18,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
    {
      recommendationId: 39,
      rooms: [
        {
          id: 'clucz7ch2000kzhqfvrhe4iu2',
          airportCode: 'YVR',
          buildingNumber: 32,
          roomNumber: '203',
          roomName: 'English Bay Combinable',
          floorNumber: 4,
          capacity: 38,
          AV: true,
          VC: true,
          attendees: [
            {
              id: 'clucz7d1m009vzhqfl1cb7h9d',
              name: 'Booking User1',
            },
            {
              id: 'clucz7d1m009wzhqf9w9b6uga',
              name: 'Booking User2',
            },
            {
              id: 'clucz7d1m009yzhqf8c5qjkhh',
              name: 'Booking User4',
            },
          ],
        },
      ],
    },
  ],
};
