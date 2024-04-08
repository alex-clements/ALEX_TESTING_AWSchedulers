const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../layers/prisma/client_local');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

const { getBuildings } = require('./get');

exports.handler = async function (event) {
  try {
    if (!prisma) prisma = await getPrisma();
    let response = {};
    const id = event?.queryStringParameters?.id; // resource parameter id
    const httpMethod = event?.httpMethod;
    if (httpMethod === 'GET') {
      response = await getBuildings(prisma, id);
    } else {
      response = {
        error: 'Method not allowed',
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
    console.error(err);
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' }),
    };
  }
};
