const { getAvailableRoomsRequest, handleError } = process.env.AWS_REGION
  ? require('/opt/dist/client')
  : require('../../layers/zod/dist/client');

async function getAvailableRoomsByBuilding(prisma, data) {
  try {
    const { buildingId, startTime, endTime } =
      getAvailableRoomsRequest.parse(data);

    const allRooms = await prisma.room.findMany({
      where: {
        buildingId: buildingId,
        isActive: true,
      },
    });

    let availableRoomsIds = await prisma.room.findMany({
      where: {
        buildingId: buildingId,
        AND: [
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
      select: {
        id: true,
      },
    });

    if (!availableRoomsIds.length) {
      const building = await prisma.building.findUnique({
        where: {
          id: buildingId,
          isActive: true,
        },
        select: {
          airportCode: true,
          number: true,
        },
      });
      if (!building) {
        return {
          error:
            'The building selected is no longer available or could not be found.',
          status: 404,
        };
      }
      const name = `${building.airportCode} ${building.number}`;

      return {
        error: `No rooms are available at this time in ${name}.`,
        status: 404,
      };
    }

    availableRoomsIds = new Set(availableRoomsIds.map((room) => room.id));

    const response = allRooms.map((room) => {
      room.available = availableRoomsIds.has(room.id);
      return room;
    });

    return response;
  } catch (err) {
    console.error('Error:', err);
    return {
      error: `Something went wrong, please try again, if the problem persists, please contact us.`,
      status: 500,
    };
  }
}

module.exports = {
  getAvailableRoomsByBuilding,
};
