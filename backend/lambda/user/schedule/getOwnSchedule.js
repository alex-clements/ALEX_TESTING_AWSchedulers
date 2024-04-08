const { getPrisma } = process.env.AWS_REGION
? require('/opt/client')
: require('../../../layers/prisma/client_local');

const {
    handleError
} = process.env.AWS_REGION
? require('/opt/dist/client')
: require('../../../layers/zod/dist/client');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

const HOUR_TIMESTAMP = 60 * 60 * 1000;

exports.handler = async function (event, context) {
  try {

    if (!prisma) prisma = await getPrisma();

    // using username instead of id from parameter to make sure users can only get their own schedule
    const username = event.requestContext.authorizer.username;

    let startDay = event?.queryStringParameters?.startDay;
    if (!startDay) {
      return {
        statusCode: 400,
        headers: headers,
        body: JSON.stringify({ error: "Start day not provided." })
      };
    }


    // convert YYYY-MM-DDTHH:MM:SS.SSSZ  to Date
    startDay = new Date(startDay);

    // make sure the start day is a Monday
    if (startDay.getDay() !== 1) {
      return {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({ error: "Start day must be a Monday." })
      };
    }

    const endDay = new Date(startDay.getTime() + (110 * HOUR_TIMESTAMP));

    const schedule = await getOwnSchedule(username, startDay, endDay);
    if (schedule == null) { // if user not found
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ error: "User not found." })
  
      };
    }

    const response = await sanitizeOutput(schedule, username);
    return {
      statusCode: response.error ? response.status : 200,
      headers: headers,
      body: response.error
        ? JSON.stringify({ error: response.error })
        : JSON.stringify({ result: response }),
    };
  } catch (err) {
    const error = handleError(err);
    return {
      statusCode: error.status,
      headers: headers,
      body: JSON.stringify({ error: error.error })
    };
  }
};

/*
* get the schedule / bookings of the user in the given week starting from startDay to endDay
*/
const getOwnSchedule = async (username, startDay, endDay) => {
  return await prisma.bookingRecord.findMany({
    where: {
      User: {
        username: username
      },
      Booking: {
        AND: [
          { startTime: { gte: startDay } }, 
          { endTime: { lte: endDay } } 
        ]
      }
    },
    include: {
      Booking: true,
      User: true,
      Room: true
      }
  });
}

const getMeetingAttendees = async (bookingId) => {
  return await prisma.bookingRecord.findMany({
    where: {
      Booking: {
        id: bookingId
      }
    },
    include: {
      User: true
    }
  });
}

const getBuildingInfo = async (roomId) => {
  return await prisma.room.findUnique({
    where: {
      id: roomId
    },
    include: {
      Building: true
    }
  });
}

const getOrganizerInfo = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
}


const sanitizeOutput = async (bookingRecords, username) => {
  const sanitizeSchedule = await Promise.all(
    bookingRecords.map(async (record) => {
      const attendees = await getMeetingAttendees(record.Booking.id);
      const building = await getBuildingInfo(record.Room.id);
      const organizer = await getOrganizerInfo(record.Booking.organizerId);
  
      const sanitizeAttendees = attendees.map((attendee) => {
        return {
          id: attendee.User.id,
          name: attendee.User.name,
          email: attendee.User.email
        }
      });
  
      const sanitizeOutput = {
        bookingId: record.Booking.id,
        startTime: record.Booking.startTime,
        endTime: record.Booking.endTime,
        name: record.Booking.name,
        organizer: {
          id: organizer.id,
          name: organizer.name,
          email: organizer.email
        },
        attendees: sanitizeAttendees,
        room: {
          id: record.Room.id,
          name: record.Room.roomName,
          number: record.Room.roomNumber,
          floorNumber: record.Room.floorNumber,
          isActive: record.Room.isActive
        },
        building: {
          airportCode: building.Building.airportCode,
          number: building.Building.number,
          location: building.Building.location
        },
        isOrganizer: organizer.username === username
      }
      return sanitizeOutput;
    }));
  return sanitizeSchedule;
}

