const { getPrisma } = require('/opt/client');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

const { getUsers } = require('./get');

exports.handler = async function (event) {
  try {
    if (!prisma) prisma = await getPrisma();

    const getMany = event?.queryStringParameters?.many;
    const username = event.requestContext.authorizer.username;
    const response = await getUsers(prisma, getMany, username);

    if (response === null) {
      return {
        statusCode: 404,
        headers: headers,
        body: JSON.stringify({ error: 'User not found.' }),
      };
    }

    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ result: response }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
