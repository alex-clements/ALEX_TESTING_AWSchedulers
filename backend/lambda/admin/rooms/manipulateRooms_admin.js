const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../../layers/prisma/client_local');

const { createRoomSchema, updateRoomSchema, handleError } = process.env
  .AWS_REGION
  ? require('/opt/dist/client')
  : require('../../../layers/zod/dist/client');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async function (event, context) {
  try {
    if (!prisma) prisma = await getPrisma();

    let response = {};

    const body = event?.body ? JSON.parse(event?.body) : {};
    const id = event?.queryStringParameters?.id; // resource parameter id
    const buildingId = event?.queryStringParameters?.building; // resource query building id
    const httpMethod = event?.httpMethod;

    if ((httpMethod == 'PUT' || httpMethod == 'DELETE') && !id) {
      response = {
        error: 'ID not provided.',
        status: 400,
      };
    } else if (httpMethod === 'POST') {
      response = await createRoom(body);
    } else if (httpMethod === 'PUT') {
      response = await updateRoom(id, body);
    } else if (httpMethod === 'DELETE') {
      response = await deleteRoom(id);
    } else if (httpMethod === 'GET') {
      if (buildingId !== undefined) {
        response = await getRoomsByBuilding(buildingId);
      } else {
        response = await getRooms(id);
      }

      if (response == null) {
        response = {
          error: 'Room not found.',
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
      body: JSON.stringify({
        error: 'Something went wrong. Please try again.',
      }),
    };
  }
};

const createRoom = async (data) => {
  try {
    data = createRoomSchema.parse(data);
    if ('Building' in data) {
      data.Building = {
        connect: {
          id: data.Building,
        },
      };
    }

    return await prisma.room.create({
      data: data,
    });
  } catch (err) {
    // if it's prisma error with error code P2002 (uniqe contraints failed)
    if (err.code === 'P2002') {
      return {
        error:
          'Duplicated room info - unqiue (room number, floor number, building id) constraint.',
        status: 400,
      };
    }
    return handleError(err);
  }
};

const updateRoom = async (id, data) => {
  try {
    data = updateRoomSchema.parse(data);

    if ('Building' in data) {
      data.Building = {
        connect: {
          id: data.Building,
        },
      };
    }

    if (Object.keys(data).length === 0) {
      return {
        error: 'Data not provided for update.',
        status: 400,
      };
    }

    return await prisma.room.update({
      where: {
        id: id,
      },
      data: data,
    });
  } catch (err) {
    // if it's prisma error with error code P2002 (uniqe contraints failed)
    if (err.code === 'P2002') {
      return {
        error:
          'Duplicated room info - unqiue (room number, floor number, building id) constraint.',
        status: 400,
      };
    }
    return handleError(err);
  }
};

const deleteRoom = async (id) => {
  try {
    return await prisma.room.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    return handleError(err);
  }
};

const getRooms = async (id) => {
  let response = {};
  if (!id) {
    response = await prisma.room.findMany();
    response = response.length === 0 ? null : response;
  } else {
    response = await prisma.room.findUnique({
      where: {
        id: id,
      },
    });
  }

  return response;
};

const getRoomsByBuilding = async (buildingId) => {
  let response = await prisma.room.findMany({
    where: {
      buildingId: buildingId,
    },
  });

  response = response.length === 0 ? null : response;

  return response;
};
