async function getUsers(prisma, getMany, username) {
  let response = {};

  if (getMany) {
    response = await prisma.user.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    return response.length ? response : null;
  }

  response = await prisma.user.findUnique({
    where: {
      isActive: true,
      username: username,
    },
    select: {
      username: true,
      name: true,
      email: true,
      floorNumber: true,
      Building: {
        select: {
          airportCode: true,
          number: true,
          location: true,
        },
      },
    },
  });

  return response;
}

module.exports = { getUsers };
