const { getPrisma } = require('/opt/client');

let prisma;

exports.handler = async function () {
  try {
    if (!prisma) prisma = await getPrisma();

    const users = await prisma.user.findMany();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ users }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: err,
      }),
    };
  }
};
