const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../../layers/prisma/client_local');

const { findBookingRequest, handleError } = process.env.AWS_REGION
  ? require('/opt/dist/client')
  : require('../../../layers/zod/dist/client');

let prisma;
const RADIUS = 0.4; // 0.4km is walking distance in 5 minutes
const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async function (event, context) {
  try {
    if (!prisma) prisma = await getPrisma();

    const body = JSON.parse(event.body);
    const data = findBookingRequest.parse(body);

    const organizer = event.requestContext.authorizer.username;
    const organizerId = await getOrganizerId(organizer);

    // adding organizer to the list of attendees
    let attendees = new Set(data.users);
    attendees.add(organizerId);
    data.users = Array.from(attendees);

    const requiredCapabilities = {
      AV: data.AV,
      VC: data.VC,
    };
    const singleRoom = data.singleRoom;
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const replaceMeeting = data.replaceMeeting;

    if (startTime > endTime) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({
          error: 'Start time should be less than end time.',
        }),
      };
    }

    if (!replaceMeeting) {
      const overlappedBooking = await doubleCheckAttendeesAvailability(
        startTime,
        endTime,
        data.users
      );
      if (overlappedBooking.length > 0) {
        return {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({
            error:
              'One or more participants are not available in this time slot.',
          }),
        };
      }
    }

    const userIds = data.users;
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      include: {
        Building: {
          include: {
            rooms: {
              where: {
                isActive: true,
                BookingRecords: {
                  none: {
                    AND: [
                      { Booking: { startTime: { lt: endTime } } },
                      { Booking: { endTime: { gt: startTime } } },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });

    const listOfOptions = singleRoom
      ? formatOutputForSingleRoomOptions(
        await findAvailableSingleRooms(users, requiredCapabilities),
        users
      )
      : formatOutput(
        await findAvailableRoomsByMerging(
          users,
          requiredCapabilities,
          startTime,
          endTime
        ),
        users
      );

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ result: listOfOptions }),
    };
  } catch (err) {
    const error = handleError(err);
    return {
      statusCode: error.statusCode,
      headers: headers,
      body: JSON.stringify({ error: error.error }),
    };
  }
};

const doubleCheckAttendeesAvailability = async (
  startTime,
  endTime,
  attendees
) => {
  return await prisma.bookingRecord.findMany({
    where: {
      AND: [
        {
          Booking: {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        },
        {
          userId: {
            in: attendees,
          },
        },
      ],
    },
  });
};

/**
 *
 * @param {*} result: array of {airportCode, options, distanceArray}
 * @returns {recommendations, participants}
 */
function formatOutputForSingleRoomOptions(result, users) {
  let recommendations = [];
  let idAcc = 0;
  for (let i = 0; i < result.length; i++) { // for every building
    for (let j = 0; j < (result[i].options.length < 10 ? result[i].options.length : 10); j++) {
      const room = result[i].options[j];
      idAcc = (i * 10) + j
      const recommendation = {
        recommendationId: idAcc,
        rooms: [room],
        distances: result[i].distanceArray
      };
      recommendations.push(recommendation);
    }
  }
  recommendations.forEach(rec => rec["totalDistance"] = rec.distances.reduce((sum, dist) => sum += dist.distance, 0))
  recommendations.sort((r1, r2) => r1.totalDistance < r2.totalDistance)

  return {
    recommendations: recommendations,
    participants: users.map((user) => {
      return {
        id: user.id,
        name: user.name,
      };
    }),
  };
}

const getOrganizerId = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user.id;
};

async function findAvailableSingleRooms(users, requiredCapabilities) {
  // get buildings
  let buildingIds = new Set();
  let buildings = [];
  for (const user of users) {
    const building = user.Building;
    if (buildingIds.has(building.id) || !building.isActive) continue;
    buildings.push(building);
    buildingIds.add(building.id);
  }

  // for each building, try fitting everyone in there
  let result = [];
  for (const building of buildings) {
    const roomsWithCapacity = building.rooms.filter(
      (room) => room.capacity >= users.length
    );

    // calculate distance to this building from every user
    let distanceArray = [];
    for (const user of users) {
      const lat = user.Building.latitude;
      const lon = user.Building.longitude;
      const distance = calculateDistance(
        lat,
        lon,
        building.latitude,
        building.longitude
      );
      distanceArray.push({
        user: {
          id: user.id,
          name: user.name,
        },
        distance: distance, // how far is a user from the building
      });
    }

    result.push({
      airportCode: building.airportCode,
      options: createRoomResult(
        findRoomsInABuilding(roomsWithCapacity, requiredCapabilities, 1),
        users,
        building.airportCode,
        building.number
      ),
      distanceArray: distanceArray,
    });
  }
  return result;
}
/**
 * find available rooms by first merging group of users close
 * assumes users have the same airport code
 */
async function findAvailableRoomsByMerging(users, requiredCapabilities, startTime, endTime) {
  let result = [];
  for (const usersWithSameAirportCode of Object.values(groupUsersByAirportCode(users))) {

    // get building
    let buildingIds = new Set();
    let buildings = [];
    for (const user of usersWithSameAirportCode) {
      const building = user.Building;
      if (buildingIds.has(building.id)) continue;
      buildings.push(building);
      buildingIds.add(building.id);
    }

    // get each building's neighbors
    for (const building of buildings) {
      building['neighbors'] = getBuildingWithinRadius(buildings, RADIUS, building.latitude, building.longitude);
    }

    // ensure we only consider active buildings
    buildings = buildings.filter(b => b.isActive);

    //sort by neighbors
    buildings = buildings.sort((b1, b2) => b2.neighbors.length - b1.neighbors.length);

    // try to form cluster and merge users
    for (let i = 0; i < buildings.length; i++) {
      const building = buildings[i];
      // get total users in this neighborhood
      const neighbors = building.neighbors.map(building => building.id);
      if (neighbors.length === 1) continue;

      const usersInNeighbors = usersWithSameAirportCode.filter(user => neighbors.includes(user.buildingId));
      // can everyone fit in this building?
      const roomsWithCapacity = building.rooms.filter(
        (room) => room.capacity >= usersInNeighbors.length
      );
      if (roomsWithCapacity.length > 0) {
        // remove neighbor buildings from the buildings to avoid considering them further
        buildings = buildings.filter(building => !neighbors.includes(building.id))
        // collect result
        result.push(...(await findAvailableRooms(building, usersInNeighbors, requiredCapabilities, startTime, endTime)));
      }
    }

    // for remaining buildings, find avaliable room as a single unit
    for (const building of buildings) {
      const usersInBuilding = usersWithSameAirportCode.filter((user) => user.buildingId === building.id);
      result.push(...(await findAvailableRooms(building, usersInBuilding, requiredCapabilities, startTime, endTime)));
    }

  }
  return result
}

function formatOutput(result, users) {
  const recommendedRooms = generateRecommendations(result);
  let recommendations = [];

  for (let i = 0; i < recommendedRooms.length; i++) {
    recommendations.push({
      recommendationId: i,
      rooms: recommendedRooms[i],
    });
  }
  const bookingOptionsInfo = {
    recommendations: recommendations,
    participants: users.map((user) => {
      return {
        id: user.id,
        name: user.name,
      };
    }),
  }

  return bookingOptionsInfo;
}

/**
 * generate combinations of rooms, thereby generating recommendations
 * @warning this function can be slow since its time/space complexity θ(n x n2 x n3 x ...)
 * where n is number of rooms in each group of users. Reduce the size of input if
 * using LIMIT to adjust the performance if needed
 */
function generateRecommendations(result) {
  let groups = [];
  for (const groupResult of result) {
    const options = groupResult.options.slice(0);
    groups.push(options);
  }

  function generateCombinations(groups) {
    const combinationResult = [];
    const LIMIT = 100;

    // Helper function to recursively generate combinations
    function backtrack(currentCombination, groupIndex) {
      if (groupIndex === groups.length) {
        combinationResult.push([...currentCombination]);
        return;
      }

      const currentGroup = groups[groupIndex];
      for (const room of currentGroup) {
        currentCombination.push(room);
        if (combinationResult.length <= LIMIT) {
          backtrack(currentCombination, groupIndex + 1);
        }
        currentCombination.pop();
      }
    }
    backtrack([], 0);
    return combinationResult;
  }

  return generateCombinations(groups);
}

/**
 * find available rooms for each user group, (A user group is users in same building)
 * throw error if users cannot fit in the same building
 */
async function findAvailableRooms(
  building,
  usersInSameBuilding,
  requiredCapabilities,
  startTime,
  endTime
) {
  let results = [];
  let roomsFromSameLocation = [];
  // const building = usersInSameBuilding[0].Building;
  const roomsWithCapacity = building.rooms.filter(
    (room) => room.capacity >= usersInSameBuilding.length
  );
  const usersSortedByFloorNumber = usersInSameBuilding.sort(
    (u1, u2) => u1.floorNumber - u2.floorNumber
  );

  if (roomsWithCapacity.length === 0) {
    try {
      roomsFromSameLocation.push(
        ...findRoomsOnMultipleFloorsGreedy(
          usersSortedByFloorNumber,
          building.rooms,
          requiredCapabilities
        )
      );
      for (const roomFromSameLocation of roomsFromSameLocation) {
        results.push({
          airportCode: building.airportCode,
          options: roomFromSameLocation,
          attendees: roomFromSameLocation[0].attendees
        });
      }
    } catch (err) {
      //warning: this is not tested
      const otherBuildings = await getAllBuildingsInSameAirport(
        building.airportCode,
        startTime,
        endTime,
        usersInSameBuilding.length
      );
      const buildingsWithinRadius = getBuildingWithinRadius(
        otherBuildings,
        RADIUS,
        building.latitude,
        building.longitude
      );

      // TODO: handle if buildingWithinRadius is empty => need to allow user to use UI to choose different building or exit

      const roomsSatisfyConstraints = [];
      for (const building of buildingsWithinRadius) {
        const result = createRoomResult(
          findRoomsInBuildings(building.rooms, requiredCapabilities),
          usersInSameBuilding,
          usersInSameBuilding[0].Building.airportCode,
          usersInSameBuilding[0].Building.number
        );
        roomsSatisfyConstraints.push(...result);
      }
      roomsFromSameLocation.push(roomsSatisfyConstraints);
    }
  } else {
    const thisFloor = areOnSameFloor(usersInSameBuilding)
      ? usersInSameBuilding[0].floorNumber
      : findMiddleFloor(usersSortedByFloorNumber);

    roomsFromSameLocation.push(
      createRoomResult(
        findRoomsInABuilding(
          roomsWithCapacity,
          requiredCapabilities,
          thisFloor
        ),
        usersInSameBuilding,
        building.airportCode,
        building.number
      )
    );
    results.push({
      airportCode: building.airportCode,
      options: roomsFromSameLocation[0],
      attendees: usersInSameBuilding.map((user) => {
        return {
          id: user.id,
          name: user.name,
        };
      }),
    });
  }

  return results;
}

// (resource: https://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const lat1Rad = (lat1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos(lat1Rad) * Math.cos(lat2Rad) * (1 - Math.cos(dLon))) / 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

const getAllBuildingsInSameAirport = async (
  airportCode,
  startTime,
  endTime,
  capacity
) => {
  return await prisma.building.findMany({
    where: {
      airportCode: airportCode,
    },
    include: {
      rooms: {
        where: {
          isActive: true,
          AND: [
            { capacity: { gte: capacity } },
            {
              BookingRecords: {
                none: {
                  AND: [
                    { Booking: { startTime: { lt: endTime } } },
                    { Booking: { endTime: { gt: startTime } } },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  });
};

const getBuildingWithinRadius = (buildings, radius, lat, lon) => {
  const filteredBuildings = buildings.filter(
    (building) =>
      calculateDistance(lat, lon, building.latitude, building.longitude) <=
      radius
  );
  return filteredBuildings.sort(
    (b1, b2) =>
      calculateDistance(lat, lon, b1.latitude, b1.longitude) -
      calculateDistance(lat, lon, b2.latitude, b2.longitude)
  );
};

/**
 * Finds smaller rooms for users using divide and conquer technique, if not found, throw error.
 * @Scenario there are no rooms that fit users of such capacity in a single room
 * @Precondition users are in the same building
 * @return array of result objects
 */
function findRoomsOnMultipleFloorsGreedy(users, rooms, requiredCapabilities) {
  let result = [];
  let remainingRooms = [...rooms];
  let usersTobeAssigned = [...users];
  let targetRoomSize = usersTobeAssigned.length;

  while (usersTobeAssigned.length > 0 && remainingRooms.length > 0 && targetRoomSize > 0) {
    const roomsWithExactCapacity = remainingRooms.filter(
      (room) => room.capacity >= targetRoomSize
    );

    if (roomsWithExactCapacity.length > 0) {
      const usersAssigned = usersTobeAssigned.splice(0, targetRoomSize);
      const pickedRoom = findRoomsInABuilding(roomsWithExactCapacity, requiredCapabilities, findMiddleFloor(usersAssigned))[0];
      // collect the room into result
      result.push(
        createRoomResult(
          [pickedRoom],
          usersAssigned,
          usersAssigned[0].Building.airportCode,
          usersAssigned[0].Building.number
        ))
      // update target room size
      targetRoomSize = usersTobeAssigned.length;
      // evict the picked room from remaining rooms
      remainingRooms = remainingRooms.filter(room => room.id !== pickedRoom.id);
    } else {
      targetRoomSize--;
    }
  }
  // TODO: add back candidate rooms 
  return result;
}

/**
 * Creates list of room in the correct format
 */
function createRoomResult(rooms, users, airportCode, buildingNumber) {
  return rooms.map((room) => {
    return {
      id: room.id,
      airportCode: airportCode,
      buildingNumber: buildingNumber,
      roomNumber: room.roomNumber,
      roomName: room.roomName,
      floorNumber: room.floorNumber,
      capacity: room.capacity,
      AV: room.AV,
      VC: room.VC,
      attendees: users.map((user) => {
        return {
          id: user.id,
          name: user.name,
        };
      }),
    };
  });
}

/**
 * Returns floor in between max and min floors
 * @Precondition users are sorted by floor number in ascending order
 */
function findMiddleFloor(users) {
  const floors = users.map((user) => user.floorNumber);
  const maxFloor = floors[floors.length - 1];
  const minFloor = floors[0];
  return Math.floor(maxFloor + minFloor / 2);
}

/**
 * Find and return a list of rooms in a single building given constraints on capabilities and floor number.
 */
function findRoomsInABuilding(rooms, requiredCapabilities, targetFloor) {
  return sortRoomsByScore(rooms, requiredCapabilities, targetFloor);
}

/**
 * Find and return a list of rooms in a multiple buildings given constraints on capabilities.
 */
function findRoomsInBuildings(rooms, requiredCapabilities) {
  return sortRoomsByScore(rooms, requiredCapabilities, null);
}

const countMatchingCap = (room, requiredCapabilities) => {
  let result = 0;
  result += room.AV && requiredCapabilities.AV ? 1 : 0;
  result += room.VC && requiredCapabilities.VC ? 1 : 0;
  return result;
};

/*
 * Sort rooms based on the score in descending order. Score is calculated as follows:
 * Higher room capacity lowers the score since extra capacity implies waste of space
 * Higher absolute difference in floor number lowers the scores
 * Meeting capabilities increases the score
 * Note1  we are using log scaling as our normalization technique
 * Note2: since log(0) = infinity, we add contant value to avoid calculating log of zero
 * Note3: adjust the WEIGHT variables to change the dynamics of room selection
 */
function sortRoomsByScore(rooms, requiredCapabilities, targetFloor) {
  function normalize(room) {
    const CAPABILITIES_WEIGHT = 6; // You can adjust this value as needed
    const CAPACITY_WEIGHT = 2; // You can adjust this value as needed
    const FLOOR_WEIGHT = 1; // You can adjust this value as needed
    const ENSURE_POSITIVE_SCORE = 100; // You can adjust this value as needed
    const floorScore =
      Math.log2(
        Math.abs(
          room.floorNumber - (targetFloor ? targetFloor : room.floorNumber)
        ) + 1
      ) * FLOOR_WEIGHT;
    const capacityScore = Math.log2(room.capacity + 1) * CAPACITY_WEIGHT;
    const capabilitiesScore =
      countMatchingCap(room, requiredCapabilities) * CAPABILITIES_WEIGHT;
    return (
      ENSURE_POSITIVE_SCORE - floorScore - capacityScore + capabilitiesScore
    );
  }
  return rooms.sort((room1, room2) => normalize(room2) - normalize(room1));
}

/**
 * group users based on airport code
 * @return {airportCode: User[]}
 */
function groupUsersByAirportCode(users) {
  return groupBy(users, (user) => user.Building.airportCode);
}
/**
 * group users based on building
 * * @return {buildingId: User[]}
 */
function groupUsersByBuilding(users) {
  return groupBy(users, (user) => user.Building.id);
}

function groupBy(array, getKey) {
  return array.reduce((acc, obj) => {
    const key = getKey(obj);
    acc[key] = acc[key] || [];
    acc[key].push(obj);
    return acc;
  }, {});
}

/**
 * return true if all the given users have the same floor number, false otherwise
 */
function areOnSameFloor(users) {
  const floorNumber = users[0].floorNumber;
  return users.every((user) => user.floorNumber === floorNumber);
}