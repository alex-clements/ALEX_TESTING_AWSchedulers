const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../layers/prisma/client_local');
const fs = require('fs');
const csv = require('csv-parser');

let prisma;
exports.handler = async function () {
  try {
    if (!prisma) prisma = await getPrisma();

    // Remove existing buildings from database
    console.log('Removing existing buildings');
    await clearBuildings(prisma);
    console.log('Existing buildings removed');

    // Add buildings to database
    const { buildings, seedMap, maxFloorMap } = await seedDB();
    console.log('got buildings and seedmap');
    await createBuildingsAndRooms(prisma, buildings, seedMap, maxFloorMap);
    console.log('done waiting for create buildings and rooms');

    // Retrieve buildings with new ids from database
    console.log('Fetching building data from DB');
    const buildingData = await prisma.building.findMany();
    console.log('Retrieved building data from DB');

    // remove users from database
    await clearUsers(prisma);

    // Add user data to database
    console.log('Seeding User Data in Database');
    await seedUsers(prisma, buildingData);
    console.log('Finished Seeding user data in database');

    if (process.env.AWS_REGION) {
      // Add users to Cognito
      console.log('Creating Cognito Users');
      await createCognitoUsers();
      console.log('Finished Creating Cognito Users');
    }

    // Add bookings and records for testing (1 booking for every week from march 14 to apr 25)
    console.log('Seeding Bookings and Records');
    await seedBookingsAndRecords(prisma);
    console.log('Finished Seeding Bookings and Records');

    // Only for testing
    // await createTestData();
    // console.log('done creating test users');

    return 'success!';
  } catch (err) {
    console.log('Something went wrong');
    return `Something went wrong ${err}`;
  }
};

function clearBuildings(prisma) {
  return new Promise((resolve, reject) => {
    prisma.building
      .deleteMany()
      .then(() => {
        console.log('Removed existing buildings');
        resolve(true);
      })
      .catch((err) => {
        console.log('Error when removing buildings: ', err);
        reject(err);
      });
  });
}

// Remove users from database
function clearUsers(prisma) {
  return new Promise((resolve, reject) => {
    prisma.user
      .deleteMany()
      .then(() => {
        console.log('Removed existing users');
        resolve(true);
      })
      .catch((err) => {
        console.log('Error when removing users: ', err);
        reject(err);
      });
  });
}

const addUserToGroup = async (cognito, username) => {
  const {
    AdminAddUserToGroupCommand,
  } = require('@aws-sdk/client-cognito-identity-provider');
  const addToGroupInput = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    GroupName: 'Admin',
  };

  const command = new AdminAddUserToGroupCommand(addToGroupInput);
  const response = await cognito.send(command);
  return response;
};

async function createCognitoUsers() {
  const userData = await getUserData();
  const cognitoUserData = [];
  userData.forEach((user) => {
    cognitoUserData.push({
      username: user.username,
      isAdmin: user.isAdmin,
      temporaryPassword: user.temporaryPassword,
      email: user.email,
    });
  });

  const cognitoUserPromises = cognitoUserData.map(async (user) => {
    try {
      const {
        CognitoIdentityProviderClient,
        AdminCreateUserCommand,
      } = require('@aws-sdk/client-cognito-identity-provider');

      let cognito = new CognitoIdentityProviderClient();
      // Create user in user pool
      let createUserInput = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.username,
        UserAttributes: [{ Name: 'email', Value: user.email }],
      };

      if (!user.temporaryPassword) {
        createUserInput = {
          DesiredDeliveryMediums: ['EMAIL'],
          ...createUserInput,
        };
      } else {
        createUserInput = {
          MessageAction: 'SUPPRESS',
          TemporaryPassword: user.temporaryPassword,
          ...createUserInput,
        };
      }

      const command = new AdminCreateUserCommand(createUserInput);
      await cognito.send(command);

      if (user.isAdmin) {
        await addUserToGroup(cognito, user.username);
      }
    } catch (err) {
      return {
        error: 'User not created in user pool',
      };
    }
  });
  await Promise.all(cognitoUserPromises);
}

// Add user data to database
function getUserData() {
  const usersData = [];
  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream('./users_data.csv')
        .pipe(csv())
        .on('data', (data) => {
          const {
            username,
            name,
            email,
            isAdmin,
            isActive,
            floorNumber,
            temporaryPassword,
          } = data;
          usersData.push({
            username,
            name,
            email,
            isAdmin: isAdmin === 'TRUE' ? true : false,
            isActive: isActive === 'TRUE' ? true : false,
            floorNumber: parseInt(floorNumber),
            temporaryPassword,
          });
        })
        .on('end', () => {
          resolve(usersData);
        });
    } catch (err) {
      reject(err);
    }
  });
}

async function seedUsers(prisma, buildings) {
  const userData = await getUserData();
  const userDataProcessed = [];
  userData.forEach((user, index) => {
    userDataProcessed.push({
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      floorNumber: user.floorNumber,
      buildingId: buildings[index % 3].id,
    });
  });

  await prisma.user.createMany({
    data: userDataProcessed,
    skipDuplicates: true,
  });
}

async function seedBookingsAndRecords(prisma) {
  let startDates = [
    new Date('2024-03-14T09:00:00'),
    new Date('2024-03-21T09:00:00'),
    new Date('2024-03-28T09:00:00'),
    new Date('2024-04-04T09:00:00'),
    new Date('2024-04-11T09:00:00'),
    new Date('2024-04-18T09:00:00'),
    new Date('2024-04-25T09:00:00'),
  ];

  let endDates = [
    new Date('2024-03-14T12:00:00'),
    new Date('2024-03-21T12:00:00'),
    new Date('2024-03-28T12:00:00'),
    new Date('2024-04-04T12:00:00'),
    new Date('2024-04-11T12:00:00'),
    new Date('2024-04-18T12:00:00'),
    new Date('2024-04-25T12:00:00'),
  ];

  const user = await prisma.user.findFirst();
  const room = await prisma.room.findFirst();

  for (let i = 0; i < startDates.length; i++) {
    let booking = await prisma.booking.create({
      data: {
        organizer: {
          connect: {
            id: user.id,
          },
        },
        startTime: startDates[i],
        endTime: endDates[i],
        name: 'test' + i,
      },
    });
    await prisma.bookingRecord.create({
      data: {
        User: {
          connect: {
            id: user.id,
          },
        },
        Booking: {
          connect: {
            id: booking.id,
          },
        },
        Room: {
          connect: {
            id: room.id,
          },
        },
      },
    });
  }
}

function seedDB() {
  const seedMap = new Map();
  const maxFloorMap = new Map();
  return new Promise((resolve, reject) => {
    fs.createReadStream('./amazon_room_data.csv')
      .pipe(csv())
      .on('data', function (data) {
        try {
          const { XXXBB, FFRRR, BBNAME, AVVC, NN } = data;

          const { AV, VC } = capabilitiesParser(AVVC);
          const { floorNumber, roomNumber } = floorRoomParser(FFRRR);

          const roomData = {
            floorNumber: floorNumber,
            roomNumber: roomNumber,
            roomName: BBNAME,
            AV: AV,
            VC: VC,
            capacity: parseInt(NN),
          };

          if (seedMap.has(XXXBB) && maxFloorMap.has(XXXBB)) {
            let roomDataArr = seedMap.get(XXXBB);
            roomDataArr.push(roomData);
            seedMap.set(XXXBB, roomDataArr);

            let maxFloor = maxFloorMap.get(XXXBB);
            if (maxFloor < roomData.floorNumber) {
              maxFloorMap.set(XXXBB, roomData.floorNumber);
            }
          } else {
            seedMap.set(XXXBB, [roomData]);
            maxFloorMap.set(XXXBB, roomData.floorNumber);
          }
        } catch (err) {
          reject(err);
        }
      })
      .on('end', () => {
        let buildings = seedMap.keys();
        resolve({ buildings, seedMap, maxFloorMap });
      });
  });
}

function capabilitiesParser(AVVC) {
  let AV = false;
  let VC = false;
  if (AVVC == 'AV/VC') {
    AV = true;
    VC = true;
  } else if (AVVC == 'AV') {
    AV = true;
  } else if (AVVC == 'VC') {
    VC = true;
  }
  return { AV, VC };
}

function floorRoomParser(FFRRR) {
  const floorRoom = FFRRR.split('.');

  let floorNumber = parseInt(floorRoom[0]);

  let roomNumber = floorRoom[1];
  if (floorRoom[2] !== undefined) {
    roomNumber += floorRoom[2];
  }

  return { floorNumber, roomNumber };
}

async function createBuildingsAndRooms(
  prisma,
  buildings,
  seedMap,
  maxFloorMap
) {
  for (let building of buildings) {
    const roomData = seedMap.get(building);
    const maxFloor = maxFloorMap.get(building);
    const buildingData = createBuildingMeta(building, maxFloor);

    await prisma.building.create({
      data: {
        ...buildingData,
        rooms: {
          createMany: {
            data: roomData,
          },
        },
      },
    });
  }
}

function createBuildingMeta(building, maxFloor) {
  const airportCodeBuilding = building.split(/(\D+)/);
  const airportCode = airportCodeBuilding[1];
  const buildingNumber = parseInt(airportCodeBuilding[2]);
  const { lat, lon, location } = getRealIncorrectLocations(
    airportCode,
    buildingNumber
  );
  return {
    airportCode: airportCode,
    number: buildingNumber,
    maxFloor: maxFloor,
    latitude: lat,
    longitude: lon,
    location: location,
  };
}

// Maps the mock buildings given to us to real buildings and provides location information for those
function getRealIncorrectLocations(airportCode, buildingNumber) {
  /*
  YVR32 -> Real YVR11
  YVR41 -> Real YVR14
  YVR63 -> Real YVR19
  YVR73 -> Real YVR20
  YVR74 -> Real YVR26
  YYZ34 -> Real YYZ18
  YUL22 -> Real AWS Technologies
  */

  let lat = 0;
  let lon = 0;
  let location = '';
  if (airportCode == 'YVR') {
    if (buildingNumber == 32) {
      lat = 49.28132420946474;
      lon = -123.11650768559132;
      location = '510 W Georgia St #14, Vancouver, BC V6B 0M3';
    } else if (buildingNumber == 41) {
      lat = 49.28176318729041;
      lon = -123.1138077983486;
      location = '402 Dunsmuir St, Vancouver, BC V6B 1X4';
    } else if (buildingNumber == 74) {
      lat = 49.280411137102476;
      lon = -123.11422842491336;
      location = '399 W Georgia St, Vancouver, BC V6B 1Z1';
    } else if (buildingNumber == 63) {
      lat = 49.28649403868768;
      lon = -123.11908313126906;
      location = '555 Burrard St, Vancouver, BC V7X 1M8';
    } else if (buildingNumber == 73) {
      lat = 49.28573544591995;
      lon = -123.11575447015588;
      location = '2400-475 Howe St, Vancouver, BC V6C 2B3';
    }
  } else if (airportCode == 'YYZ') {
    if (buildingNumber == 34) {
      lat = 43.643292931173306;
      lon = -79.38258455950431;
      location = '18 York St Floor 7, Suite 700, Toronto, ON M5J 2T8';
    }
  } else if (airportCode == 'YUL') {
    if (buildingNumber == 22) {
      lat = 45.52822745850151;
      lon = -73.62693587735716;
      location = "7335 Bd de l'Acadie, Montréal, QC H3N 2V7";
    }
  }
  return { lat, lon, location };
}

// Create mock locations based on the buildings given to us (as these buildings not actually exist)
function getMockLocations(airportCode, buildingNumber) {
  let lat = 0;
  let lon = 0;
  let location = '';
  if (airportCode == 'YVR') {
    lat = 49.1934;
    lon = -123.1751;
    if (buildingNumber == 32) {
      lat += 32;
      lon += 32;
      location = '32 Amazon Street, Vancouver, BC';
    } else if (buildingNumber == 41) {
      lat += 41;
      lon += 41;
      location = '41 Amazon Street, Vancouver, BC';
    } else if (buildingNumber == 74) {
      lat += 74;
      lon += 74;
      location = '74 Amazon Street, Vancouver, BC';
    } else if (buildingNumber == 63) {
      lat += 63;
      lon += 63;
      location = '63 Amazon Street, Vancouver, BC';
    } else if (buildingNumber == 73) {
      lat += 73;
      lon += 73;
      location = '73 Amazon Street, Vancouver, BC';
    }
  } else if (airportCode == 'YYZ') {
    lat = 43.6771;
    lon = -79.6334;
    if (buildingNumber == 34) {
      lat += 34;
      lon += 34;
      location = '34 Amazon Street, Toronto, ON';
    }
  } else if (airportCode == 'YUL') {
    lat = 45.4657;
    lon = -73.7455;
    if (buildingNumber == 22) {
      lat += 22;
      lon += 22;
      location = '22 Amazon Street, Montreal, QC';
    }
  }
  return { lat, lon, location };
}

// async function createTestData() {
//   const building = await prisma.building.findFirst();
//   const users = [
//     {
//       username: 'Dhairya',
//       name: 'Dhairya',
//       isAdmin: true,
//       floorNumber: 5,
//     },
//     {
//       username: 'Taylor',
//       name: 'Taylor',
//       isAdmin: true,
//       floorNumber: 5,
//     },
//     {
//       username: 'Seungwon',
//       name: 'Seungwon',
//       isAdmin: true,
//       floorNumber: 5,
//     },
//   ];

//   try {
//     for (let user of users) {
//       await prisma.user.create({
//         data: {
//           username: user.username,
//           name: user.name,
//           isAdmin: user.isAdmin,
//           floorNumber: user.floorNumber,
//           Building: { connect: { id: building.id } },
//         },
//       });
//     }

//   } catch (err) {
//     console.log(err);
//   }
// }
