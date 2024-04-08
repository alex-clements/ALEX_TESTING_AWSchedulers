exports.handler = async function (event, context) {
  const isAdmin = event?.requestContext?.authorizer?.isInAdminGroup;

  console.log(event?.requestContext);

  const headers = {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
  };

  if (isAdmin !== undefined) {
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        result: { status: 'ok', isAdmin: isAdmin === 'true' },
      }),
    };
  } else {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ result: { status: 'Access Denied' } }),
    };
  }
};
