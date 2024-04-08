const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../../layers/prisma/client_local');

const { createBuildingSchema, updateBuildingSchema, handleError } = process.env
  .AWS_REGION
  ? require('/opt/dist/client')
  : require('../../../layers/zod/dist/client');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

// TODO: Update everything building related with max floor
// when that gets merged to main
exports.handler = async function (event) {
  try {
    if (!prisma) prisma = await getPrisma();
    let response = {};
    const body = event?.body ? JSON.parse(event?.body) : {};
    const id = event?.queryStringParameters?.id; // resource parameter id
    const httpMethod = event?.httpMethod;

    if ((httpMethod == 'PUT' || httpMethod == 'DELETE') && !id) {
      response = {
        error: 'ID not provided.',
        status: 400,
      };
    } else if (httpMethod === 'POST') {
      response = await createBuilding(body);
    } else if (httpMethod === 'PUT') {
      response = await updateBuilding(id, body);
    } else if (httpMethod === 'DELETE') {
      response = await deleteBuilding(id);
    } else {
      response = {
        error: 'Method not allowed.',
        status: 405,
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
      body: JSON.stringify({
        error: 'Something went wrong. Please try again.',
      }),
    };
  }
};

const duplicatedBuildingInfoUpdate = async (data, id) => {
  const building = await prisma.building.findUnique({
    where: {
      id: id,
    },
  });

  if (
    building.airportCode === data.airportCode &&
    building.number === data.number
  ) {
    return false;
  }

  // get all the info needed for checking if one or both of them is updated
  let airportCode = data.airportCode ? data.airportCode : building.airportCode;
  let number = data.number ? data.number : building.number;

  const duplicatedBuilding = await prisma.building.findFirst({
    where: {
      AND: [{ airportCode: airportCode }, { number: number }],
    },
  });

  return duplicatedBuilding !== null;
};

const duplicatedBuildingInfo = async (data) => {
  const duplicatedBuilding = await prisma.building.findFirst({
    where: {
      AND: [{ airportCode: data.airportCode }, { number: data.number }],
    },
  });

  return duplicatedBuilding !== null;
};

const createBuilding = async (data) => {
  try {
    data = createBuildingSchema.parse(data);
    if (await duplicatedBuildingInfo(data)) {
      return {
        error:
          'Duplicated building info - unique (airport code, number) constraint.',
        status: 400,
      };
    }

    return await prisma.building.create({
      data: data,
    });
  } catch (err) {
    return handleError(err);
  }
};

const updateBuilding = async (id, data) => {
  try {
    data = updateBuildingSchema.parse(data);
    if (await duplicatedBuildingInfoUpdate(data, id)) {
      return {
        error:
          'Duplicated building info - unique (airport code, number) constraint.',
        status: 400,
      };
    }

    if (Object.keys(data).length === 0) {
      return {
        error: 'Data not provided for update.',
        status: 400,
      };
    }

    if (data.isActive == false) {
      await disableRoomsOnDisableBuilding(id);
    }

    if (data.activateAllRooms == true) {
      await enableAllRooms(id);
    }

    if ("activateAllRooms" in data) {
        delete data.activateAllRooms;
    }

    return await prisma.building.update({
      where: {
        id: id,
      },
      data: data,
    });
  } catch (err) {
    return handleError(err);
  }
};

const disableRoomsOnDisableBuilding = async (id) => {
  try {
    await prisma.room.updateMany({
      where: { buildingId: id },
      data: {
        isActive: false,
      },
    });
  } catch (err) {
    return handleError(err);
  }
};

const enableAllRooms = async (id) => {
    try {
      await prisma.room.updateMany({
        where: { buildingId: id },
        data: {
          isActive: true,
        },
      });
    } catch (err) {
      return handleError(err);
    }
  };

// Not using this anymore
const deleteBuilding = async (id) => {
  try {
    return await prisma.building.delete({
      where: {
        id: id,
      },
    });
  } catch (err) {
    return handleError(err);
  }
};
