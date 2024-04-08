async function getBuildings(prisma, id) {
  let response = {};

  if (!id) {
    response = await prisma.building.findMany();
    response = response.length === 0 ? null : response;
  } else {
    response = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });
  }

  return response;
}

module.exports = {
  getBuildings,
};
