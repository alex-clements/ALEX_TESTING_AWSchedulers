const {
  handler,
} = require('../../lambda/admin/buildings/manipulateBuildings_admin');

const { getPrisma } = require('../../layers/prisma/client_local');

describe('GET /admin/buildings', () => {
  let prisma;
  beforeAll(async () => {
    prisma = await getPrisma();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it('Gets all buildings', async () => {
    const event = {
      httpMethod: 'GET',
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const results = body.result;
    expect(results.length).toBeGreaterThan(5);
  });

  it('Gets a single building', async () => {
    const building = await prisma.building.findFirst();
    const event = {
      httpMethod: 'GET',
      queryStringParameters: {
        id: building.id,
      },
    };
    const response = await handler(event);
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    const result = body.result;
    expect(result).toEqual(building);
  });
});
