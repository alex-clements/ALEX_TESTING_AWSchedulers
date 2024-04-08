const { CognitoJwtVerifier } = require('aws-jwt-verify');

// Attribution: https://github.com/awslabs/aws-jwt-verify?#api-gateway-lambda-authorizer---rest
// Create the verifier outside the Lambda handler (= during cold start),
// so the cache can be reused for subsequent invocations. Then, only during the
// first invocation, will the verifier actually need to fetch the JWKS.
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.CLIENT_ID,
});

exports.handler = async (event, context) => {
  if (!event.headers) {
    throw new Error('Unauthorized');
  }

  const accessToken = event?.headers['Authorization'];
  let payload;
  try {
    // If the token is not valid, an error is thrown:
    payload = await jwtVerifier.verify(accessToken);
  } catch (error) {
    console.error('Error:', error);
    // API Gateway wants this *exact* error message, otherwise it returns 500 instead of 401:
    throw new Error('Unauthorized');
  }

  // Authorizer can be changed in the future based on needs

  const isInAdminGroup =
    payload['cognito:groups'] && payload['cognito:groups'].includes('Admin');

  const methodArn = event.methodArn; // arn:aws:execute-api:{regionId}:{accountId}:{apiId}/{stage}/{httpVerb}/[{resource}/[{child-resources}]]
  const gatewayArn = methodArn.split('/', 2).join('/') + '/*'; // arn:aws:execute-api:{regionId}:{accountId}:{apiId}/{stage}/*
  const adminResourceArn = methodArn.split('/', 2).join('/') + '/*/admin/*'; // arn:aws:execute-api:{regionId}:{accountId}:{apiId}/{stage}/*/admin/*

  const principalId = payload.sub;
  // Deny overrides allow hence the policy provides full access then denies or allows for all resources under the admin route
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: isInAdminGroup ? 'Allow' : 'Deny',
          Resource: adminResourceArn,
        },
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: gatewayArn,
        },
      ],
    },
    //  Can add additional context to send to backend lambdas here
    context: {
      username: payload.username,
      isInAdminGroup: !!isInAdminGroup,
    },
  };
};
