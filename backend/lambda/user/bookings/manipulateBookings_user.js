const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../../layers/prisma/client_local');
const { createBookingSchema, handleError } = process.env.AWS_REGION
  ? require('/opt/dist/client')
  : require('../../../layers/zod/client');

let prisma;

class BookingError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BookingError';
  }
}

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async function (event, context) {
  try {
    if (!prisma) prisma = await getPrisma();

    let response = {};
    const body = event?.body ? JSON.parse(event?.body) : {};
    const id = event?.queryStringParameters?.id;
    const httpMethod = event?.httpMethod;
    const username = event.requestContext.authorizer.username;

    if ((httpMethod == 'GET' || httpMethod == 'DELETE') && !id) {
      response = {
        error: 'ID not provided.',
        status: 400,
      };
    } else if (httpMethod === 'POST') {
      body.organizer = await getOrganizerId(username);
      response = await createBooking(body);
    } else if (httpMethod === 'DELETE') {
      response = await deleteBooking(id, username);
    } else if (httpMethod === 'GET') {
      response = await getBooking(id);

      if (response === null) {
        response = {
          error: 'Booking not found.',
          status: 404,
        };
      }
    }

    return {
      statusCode: 'error' in response ? response.status : 200,
      headers: headers,
      body:
        'error' in response
          ? JSON.stringify({ error: response.error })
          : JSON.stringify({ result: response }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

const getOrganizerId = async (username) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user.id;
};

const getOverlappedBookings = async (tx, startTime, endTime, rooms) => {
  return await tx.bookingRecord.findMany({
    where: {
      AND: [
        {
          Booking: {
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
        },
        {
          roomId: {
            in: rooms,
          },
        },
      ],
    },
  });
};

const getAttendeesOverlappedBookings = async (
  tx,
  startTime,
  endTime,
  attendees
) => {
  return await tx.bookingRecord.findMany({
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

const lockRooms = async (tx, rooms) => {
  const roomsString = '(' + rooms.join(',') + ')';
  return await tx.$queryRaw`SELECT * FROM Room R WHERE R.id in (${roomsString}) FOR UPDATE`;
};

const lockUsers = async (tx, users) => {
  const usersString = '(' + users.join(',') + ')';
  return await tx.$queryRaw`SELECT * FROM User U WHERE U.id in (${usersString}) FOR UPDATE`;
};

const createBooking = async (data) => {
  try {
    data = createBookingSchema.parse(data);
    data.organizer = {
      connect: {
        id: data.organizer,
      },
    };
    await prisma.$transaction(
      async (tx) => {
        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);

        await lockRooms(
          tx,
          data.roomUser.map((room) => room.id)
        );

        await lockUsers(tx, data.roomUser.map((room) => room.users).flat());

        let overlappedBookings = await getOverlappedBookings(
          tx,
          startTime,
          endTime,
          data.roomUser.map((room) => room.id)
        );

        if (overlappedBookings.length > 0) {
          throw new BookingError(
            'One or more selected rooms are no longer available. Please try again.'
          );
        }

        overlappedBookings = await getAttendeesOverlappedBookings(
          tx,
          startTime,
          endTime,
          data.roomUser.map((room) => room.users).flat()
        );

        if (overlappedBookings.length > 0) {
          throw new BookingError(
            'One or more participants are no longer available. Please try again.'
          );
        }

        let bookingData = {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          organizer: data.organizer,
        };
        let response = await tx.booking.create({
          data: bookingData,
        });

        let { roomUser } = data;
        for (let room of roomUser) {
          for (let user of room.users) {
            await tx.bookingRecord.create({
              data: {
                User: {
                  connect: {
                    id: user,
                  },
                },
                Booking: {
                  connect: {
                    id: response.id,
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
      },
      {
        isolationLevel: 'Serializable',
        timeout: 8000,
      }
    );

    return { result: 'Booking and Booking Records created' };
  } catch (err) {
    console.log('CreateBookings error occurred:', err);
    if (err instanceof BookingError) {
      return {
        status: 500,
        error: err.message,
      };
    }
    return handleError(err);
  }
};

const deleteBooking = async (id, username) => {
  try {
    return await prisma.booking.delete({
      where: {
        id: id,
        organizer: {
          username: username,
        },
      },
    });
  } catch (err) {
    console.log('deleteBooking error: ', err);
    return handleError(err);
  }
};

const getBooking = async (id) => {
  try {
    return await prisma.booking.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        organizer: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });
  } catch (err) {
    return handleError(err);
  }
};

// const testSchema = {
//     name: "B1",
//     startTime: "2024-03-05T00:00:00Z",
//     endTime: "2024-03-05T10:00:00Z",
//     organizer: "clteqa8fh009vicl3qfac2uk7",
//     roomUser: [{
//         id: "clteqa8d80001icl3yjwkdlyc",
//         users: ["clteqa8fh009vicl3qfac2uk7", "clteqa8fl009wicl3ip9vefrn"]
//     },
// {
//     id: "clteqa8d80002icl3x8lb10r5",
//     users: ["clteqa8fo009xicl35f9lqgos"]

// }]
// }

// createBooking(testSchema);
// async function test() {
//     // console.log(await createBooking(testSchema));
//     console.log(await getBooking("clteqxjov00005ddgj4sh6me6"))
//     console.log(await deleteBooking("clteqxjov00005ddgj4sh6me6","Dhairya"))
// }
// test()
/* (deprecated)
const updateBooking = async (id, data, username) => {
    if (id === undefined) {
        return {
            error: "id missing - prisma.update failed",
            status: 400
        };
    } 

    try {
        data = bookingSchema.parse(data);
        if (organizer in data) {
            data.organizer = {
                connect: {
                    id: data.organizer
                }
            };
        }

        if (Object.keys(data).length === 0) {
            return {
                error: "No data provided - prisma.update failed",
                status: 400
            };
        }

        return await prisma.booking.update({
            where: {
                id: id,
                organizer: {
                    username: username
                } 
            },
            data: data
        });

    } catch (err) {
        return {
            error: err.message,
            status: 400
        };
    }
}
*/
