const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../layers/prisma/client_local');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

const { getAvailableRoomsByBuilding } = require('./getAvailableRooms');

exports.handler = async function (event) {
  let data = JSON.parse(event.body);
  if (!prisma) prisma = await getPrisma();
  const response = await getAvailableRoomsByBuilding(prisma, data);

  return {
    statusCode: response.status,
    headers: headers,
    body: response.error
      ? JSON.stringify({ error: response.error })
      : JSON.stringify({ result: response }),
  };
};
