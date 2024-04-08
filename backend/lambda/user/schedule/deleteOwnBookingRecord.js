const { getPrisma } = require('/opt/client');
const { recordSchema, handleError } = require('/opt/dist/client');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async function (event, context) {
  try {
    if (!prisma) prisma = await getPrisma();
    const data = event?.body ? JSON.parse(event?.body) : {};

    // using username instead of id from parameter to make sure users can only get their own schedule
    const username = event.requestContext.authorizer.username;

    const response = await deleteOwnBookingRecord(username, data);
    if (response == null) {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({
          error: 'Booking not found.',
        }),
      };
    }

    return {
      statusCode: response.error ? response.status : 200,
      headers: headers,
      body: response.error
        ? JSON.stringify({ error: response.error })
        : JSON.stringify({ result: response }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: "Something went wrong. Please try again" }),
    };
  }
};

const getUserId = async (username) => {
  const response = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
    },
  });
  return response ? response.id : null;
};

const deleteOwnBookingRecord = async (username, data) => {
  try {
    data = recordSchema.parse(data);
    const userId = await getUserId(username);

    if (data.userId !== userId) {
      // make sure users can only delete their own schedule
      return {
        error: 'Current user do not have permission to delete this schedule.',
        status: 403,
      };
    }

    return await prisma.bookingRecord.delete({
      where: data,
    });
  } catch (err) {
    return handleError(err);
  }
};
